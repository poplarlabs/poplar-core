// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Poplar is ReentrancyGuard, Pausable, AccessControl {
    // Constants
    uint256 public constant MINIMUM_STAKE = 100 * 10**18; // 100 ROOT tokens
    uint256 public constant VALIDATION_PERIOD = 2 days;
    uint256 public constant VALIDATION_THRESHOLD = 66; // 66% for consensus
    uint256 public constant CONTRIBUTOR_REWARD_SHARE = 50; // 50%
    uint256 public constant VOTER_REWARD_SHARE = 40; // 40%
    uint256 public constant TREASURY_SHARE = 10; // 10%

    // Roles
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // State variables
    IERC20 public immutable rootToken;
    uint256 private _nextPropertyId;

    // Structs
    struct Property {
        uint256 id;
        address submitter;
        string ipfsHash;       // IPFS hash containing property details
        uint256 stakedAmount;
        uint256 lastUpdateTime;
        bool validated;
        ValidationStatus validationStatus;
    }

    struct Validation {
        uint256 propertyId;
        uint256 fee;
        uint256 startTime;
        uint256 totalStaked;
        uint256 positiveStake;
        bool concluded;
        mapping(address => Stake) stakes;
    }

    struct Stake {
        uint256 amount;
        bool support;
        bool claimed;
    }

    enum ValidationStatus {
        None,
        Pending,
        Approved,
        Rejected
    }

    // Mappings
    mapping(uint256 => Property) public properties;
    mapping(uint256 => Validation) public validations;

    // Events
    event PropertySubmitted(
        uint256 indexed propertyId,
        address indexed submitter,
        string ipfsHash,
        uint256 stakedAmount
    );

    event ValidationRequested(
        uint256 indexed propertyId,
        address indexed requester,
        uint256 fee
    );

    event ValidationVoteCast(
        uint256 indexed propertyId,
        address indexed voter,
        uint256 stake,
        bool support
    );

    event ValidationCompleted(
        uint256 indexed propertyId,
        bool approved,
        uint256 totalStake
    );

    event RewardDistributed(
        uint256 indexed propertyId,
        address indexed recipient,
        uint256 amount
    );

    // Errors
    error InsufficientStake();
    error ValidationPeriodNotEnded();
    error ValidationAlreadyInProgress();
    error ValidationNotInProgress();
    error AlreadyVoted();
    error InvalidPropertyId();
    error InsufficientFee();
    error RewardAlreadyClaimed();

    constructor(address _rootToken) {
        rootToken = IERC20(_rootToken);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
    }

    // Functions
    function submitProperty(string calldata ipfsHash) external nonReentrant whenNotPaused {
        require(bytes(ipfsHash).length > 0, "Empty IPFS hash");

        uint256 propertyId = _nextPropertyId++;

        // Transfer stake from submitter
        require(
            rootToken.transferFrom(msg.sender, address(this), MINIMUM_STAKE),
            "Stake transfer failed"
        );

        properties[propertyId] = Property({
            id: propertyId,
            submitter: msg.sender,
            ipfsHash: ipfsHash,
            stakedAmount: MINIMUM_STAKE,
            lastUpdateTime: block.timestamp,
            validated: false,
            validationStatus: ValidationStatus.None
        });

        emit PropertySubmitted(propertyId, msg.sender, ipfsHash, MINIMUM_STAKE);
    }

    function requestValidation(uint256 propertyId, uint256 fee) external nonReentrant whenNotPaused {
        if (fee < MINIMUM_STAKE) revert InsufficientFee();
        Property storage property = properties[propertyId];
        if (property.submitter == address(0)) revert InvalidPropertyId();
        if (property.validationStatus == ValidationStatus.Pending) revert ValidationAlreadyInProgress();

        require(
            rootToken.transferFrom(msg.sender, address(this), fee),
            "Fee transfer failed"
        );

        Validation storage validation = validations[propertyId];
        validation.propertyId = propertyId;
        validation.fee = fee;
        validation.startTime = block.timestamp;
        validation.concluded = false;

        property.validationStatus = ValidationStatus.Pending;

        emit ValidationRequested(propertyId, msg.sender, fee);
    }

    function castValidationVote(uint256 propertyId, uint256 stake, bool support)
        external
        nonReentrant
        whenNotPaused
    {
        Validation storage validation = validations[propertyId];
        if (validation.startTime == 0) revert ValidationNotInProgress();
        if (validation.stakes[msg.sender].amount > 0) revert AlreadyVoted();
        if (stake < MINIMUM_STAKE) revert InsufficientStake();

        require(
            rootToken.transferFrom(msg.sender, address(this), stake),
            "Stake transfer failed"
        );

        validation.stakes[msg.sender] = Stake({
            amount: stake,
            support: support,
            claimed: false
        });

        validation.totalStaked += stake;
        if (support) {
            validation.positiveStake += stake;
        }

        emit ValidationVoteCast(propertyId, msg.sender, stake, support);
    }

    function concludeValidation(uint256 propertyId) external nonReentrant whenNotPaused {
        Validation storage validation = validations[propertyId];
        Property storage property = properties[propertyId];

        if (validation.startTime == 0) revert ValidationNotInProgress();
        if (block.timestamp < validation.startTime + VALIDATION_PERIOD) revert ValidationPeriodNotEnded();
        if (validation.concluded) revert("Already concluded");

        bool approved = (validation.positiveStake * 100) / validation.totalStaked >= VALIDATION_THRESHOLD;

        property.validated = approved;
        property.validationStatus = approved ? ValidationStatus.Approved : ValidationStatus.Rejected;
        validation.concluded = true;

        // If rejected, slash the submitter's stake
        if (!approved) {
            uint256 submitterStake = property.stakedAmount;
            property.stakedAmount = 0;
            require(
                rootToken.transfer(address(this), submitterStake),
                "Stake slashing failed"
            );
        }

        emit ValidationCompleted(propertyId, approved, validation.totalStaked);
    }

    function claimRewards(uint256 propertyId) external nonReentrant {
        Validation storage validation = validations[propertyId];
        Property storage property = properties[propertyId];

        require(validation.concluded, "Validation not concluded");
        require(!validation.stakes[msg.sender].claimed, "Already claimed");

        if (property.validationStatus == ValidationStatus.Approved) {
            uint256 reward = _calculateReward(
                validation.fee,
                validation.stakes[msg.sender].amount,
                validation.totalStaked,
                validation.stakes[msg.sender].support
            );

            validation.stakes[msg.sender].claimed = true;

            require(
                rootToken.transfer(msg.sender, reward),
                "Reward transfer failed"
            );

            emit RewardDistributed(propertyId, msg.sender, reward);
        }
    }

    // Internal functions
    function _calculateReward(
        uint256 fee,
        uint256 stake,
        uint256 totalStake,
        bool supported
    ) internal pure returns (uint256) {
        if (!supported) return 0;

        uint256 voterPoolReward = (fee * VOTER_REWARD_SHARE) / 100;
        return (voterPoolReward * stake) / totalStake;
    }

    // Admin functions
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }
}
