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
    bytes32 public constant LOCATION_MANAGER_ROLE = keccak256("LOCATION_MANAGER_ROLE");

    // State variables
    IERC20 public immutable rootToken;
    bytes32[] private _pendingValidationIds;

    // Location management
    mapping(string => bool) public allowedCountries;
    mapping(string => mapping(string => bool)) public allowedRegions; // country => region => allowed
    mapping(string => mapping(string => mapping(string => bool))) public allowedLocalities; // country => region => locality => allowed
    mapping(bytes32 => bool) public registeredPropertyIds; // Hash of combined location identifier

    // Structs
    struct Property {
        bytes32 id; // keccak256(country-region-locality-parcel)
        address submitter;
        string country;
        string region;
        string locality;
        string parcel;
        string ipfsHash;       // IPFS hash containing property details
        uint256 stakedAmount;
        uint256 lastUpdateTime;
        bool validated;
        ValidationStatus validationStatus;
    }

    struct Validation {
        bytes32 propertyId;
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
    mapping(bytes32 => Property) public properties;
    mapping(bytes32 => Validation) public validations;

    // Events
    event PropertySubmitted(
        bytes32 indexed propertyId,
        address indexed submitter,
        string country,
        string region,
        string locality,
        string parcel,
        string ipfsHash,
        uint256 stakedAmount
    );

    event ValidationRequested(
        bytes32 indexed propertyId,
        address indexed requester,
        uint256 fee
    );

    event ValidationVoteCast(
        bytes32 indexed propertyId,
        address indexed voter,
        uint256 stake,
        bool support
    );

    event ValidationCompleted(
        bytes32 indexed propertyId,
        bool approved,
        uint256 totalStake
    );

    event RewardDistributed(
        bytes32 indexed propertyId,
        address indexed recipient,
        uint256 amount
    );

    event LocationAdded(
        string indexed locationType,
        string country,
        string region,
        string locality
    );

    event LocationRemoved(
        string indexed locationType,
        string country,
        string region,
        string locality
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
    error InvalidLocation();
    error PropertyAlreadyRegistered();
    error EmptyString();

    constructor(address _rootToken) {
        rootToken = IERC20(_rootToken);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(LOCATION_MANAGER_ROLE, msg.sender);
    }

    // Location management functions
    function addCountry(string calldata country) external onlyRole(LOCATION_MANAGER_ROLE) {
        if (bytes(country).length == 0) revert EmptyString();
        allowedCountries[country] = true;
        emit LocationAdded("country", country, "", "");
    }

    function addRegion(string calldata country, string calldata region) external onlyRole(LOCATION_MANAGER_ROLE) {
        if (!allowedCountries[country]) revert InvalidLocation();
        if (bytes(region).length == 0) revert EmptyString();
        allowedRegions[country][region] = true;
        emit LocationAdded("region", country, region, "");
    }

    function addLocality(string calldata country, string calldata region, string calldata locality) external onlyRole(LOCATION_MANAGER_ROLE) {
        if (!allowedRegions[country][region]) revert InvalidLocation();
        if (bytes(locality).length == 0) revert EmptyString();
        allowedLocalities[country][region][locality] = true;
        emit LocationAdded("locality", country, region, locality);
    }

    function removeCountry(string calldata country) external onlyRole(LOCATION_MANAGER_ROLE) {
        allowedCountries[country] = false;
        emit LocationRemoved("country", country, "", "");
    }

    function removeRegion(string calldata country, string calldata region) external onlyRole(LOCATION_MANAGER_ROLE) {
        allowedRegions[country][region] = false;
        emit LocationRemoved("region", country, region, "");
    }

    function removeLocality(string calldata country, string calldata region, string calldata locality) external onlyRole(LOCATION_MANAGER_ROLE) {
        allowedLocalities[country][region][locality] = false;
        emit LocationRemoved("locality", country, region, locality);
    }

    function isValidLocation(
        string calldata country,
        string calldata region,
        string calldata locality
    ) public view returns (bool) {
        return allowedCountries[country] &&
               allowedRegions[country][region] &&
               allowedLocalities[country][region][locality];
    }

    function generatePropertyId(
        string calldata country,
        string calldata region,
        string calldata locality,
        string calldata parcel
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(country, "-", region, "-", locality, "-", parcel));
    }

    // Functions
    function submitProperty(
        string calldata country,
        string calldata region,
        string calldata locality,
        string calldata parcel,
        string calldata ipfsHash
    ) external nonReentrant whenNotPaused {
        if (bytes(ipfsHash).length == 0) revert EmptyString();
        if (!isValidLocation(country, region, locality)) revert InvalidLocation();

        bytes32 propertyId = generatePropertyId(country, region, locality, parcel);
        if (registeredPropertyIds[propertyId]) revert PropertyAlreadyRegistered();

        // Transfer stake from submitter
        require(
            rootToken.transferFrom(msg.sender, address(this), MINIMUM_STAKE),
            "Stake transfer failed"
        );

        properties[propertyId] = Property({
            id: propertyId,
            submitter: msg.sender,
            country: country,
            region: region,
            locality: locality,
            parcel: parcel,
            ipfsHash: ipfsHash,
            stakedAmount: MINIMUM_STAKE,
            lastUpdateTime: block.timestamp,
            validated: false,
            validationStatus: ValidationStatus.None
        });

        registeredPropertyIds[propertyId] = true;

        emit PropertySubmitted(
            propertyId,
            msg.sender,
            country,
            region,
            locality,
            parcel,
            ipfsHash,
            MINIMUM_STAKE
        );
    }

    function requestValidation(bytes32 propertyId, uint256 fee) external nonReentrant whenNotPaused {
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
        _pendingValidationIds.push(propertyId);

        emit ValidationRequested(propertyId, msg.sender, fee);
    }

    function castValidationVote(bytes32 propertyId, uint256 stake, bool support)
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

    function concludeValidation(bytes32 propertyId) external nonReentrant whenNotPaused {
        Validation storage validation = validations[propertyId];
        Property storage property = properties[propertyId];

        if (validation.startTime == 0) revert ValidationNotInProgress();
        if (block.timestamp < validation.startTime + VALIDATION_PERIOD) revert ValidationPeriodNotEnded();
        if (validation.concluded) revert("Already concluded");

        bool approved = (validation.positiveStake * 100) / validation.totalStaked >= VALIDATION_THRESHOLD;

        property.validated = approved;
        property.validationStatus = approved ? ValidationStatus.Approved : ValidationStatus.Rejected;
        validation.concluded = true;

        // Remove from pending validations
        _removePendingValidation(propertyId);

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

    function claimRewards(bytes32 propertyId) external nonReentrant {
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

    // View functions
    function getPropertiesNeedingValidation() external view returns (Property[] memory) {
        Property[] memory pendingProperties = new Property[](_pendingValidationIds.length);

        for (uint i = 0; i < _pendingValidationIds.length; i++) {
            pendingProperties[i] = properties[_pendingValidationIds[i]];
        }

        return pendingProperties;
    }

    function getPendingValidationCount() external view returns (uint256) {
        return _pendingValidationIds.length;
    }

    function isCountryAllowed(string calldata country) external view returns (bool) {
        return allowedCountries[country];
    }

    function isRegionAllowed(string calldata country, string calldata region) external view returns (bool) {
        return allowedRegions[country][region];
    }

    function isLocalityAllowed(
        string calldata country,
        string calldata region,
        string calldata locality
    ) external view returns (bool) {
        return allowedLocalities[country][region][locality];
    }

    function isPropertyRegistered(bytes32 propertyId) external view returns (bool) {
        return registeredPropertyIds[propertyId];
    }

    // Internal functions
    function _removePendingValidation(bytes32 propertyId) internal {
        for (uint i = 0; i < _pendingValidationIds.length; i++) {
            if (_pendingValidationIds[i] == propertyId) {
                // Move the last element to this position and pop
                _pendingValidationIds[i] = _pendingValidationIds[_pendingValidationIds.length - 1];
                _pendingValidationIds.pop();
                break;
            }
        }
    }

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
