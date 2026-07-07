// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// Interface for our specific contracts
interface IRootToken {
    function mint(address to, uint256 amount) external;
}

interface IPoplarParameters {
    function sStakeAmount() external view returns (uint256);
    function valStakeAmount() external view returns (uint256);
    function consensusThresholdPercent() external view returns (uint256);
    function validationDurationSeconds() external view returns (uint256);
    function rewardInitialFactor() external view returns (uint256);
    function rewardTargetProperties() external view returns (uint256);
    function slashingPenaltyPercent() external view returns (uint256);
}

/**
 * @title SubmissionValidation
 * @notice Core contract managing property data submission, validation, staking, and rewards.
 */
contract SubmissionValidation is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    uint256 public constant CHALLENGE_PERIOD_DAYS = 7;
    uint256 public constant CHALLENGE_PERIOD_SECONDS = CHALLENGE_PERIOD_DAYS * 24 * 60 * 60;

    // --- State Variables --- //

    IERC20 public immutable rootToken;
    address public immutable poplarParametersAddress; // Address of the PoplarParameters contract
    address public treasuryAddress; // Address where slashed funds are sent

    uint256 public nextSubmissionId;
    uint256 public validatedPropertyCount; // N_validated

    // Mappings
    mapping(uint256 => Submission) public submissions;
    // submissionId => validatorAddress => Vote
    mapping(uint256 => mapping(address => Vote)) public votes;
    // Keep track of voters per submission for iteration (can be gas intensive)
    mapping(uint256 => address[]) public submissionVoters;

    // --- Structs & Enums --- //

    enum Status { PendingValidation, ValidationOpen, Validated, Rejected }

    struct Submission {
        address submitter;
        string dataPointer;      // e.g., IPFS CID
        uint256 submissionTime;
        uint256 validationDeadline;
        Status status;
        uint256 totalYesStake;
        uint256 totalNoStake;
        uint256 submitterStake; // Store the sStakeAmount used for this submission
    }

    struct Vote {
        bool choice;        // true=Accept, false=Reject
        uint256 stakeAmount; // Store the valStakeAmount used for this vote
        bool processed;     // Flag to prevent double processing in finalization
    }

    // --- Events --- //

    event SubmissionReceived(
        uint256 indexed submissionId,
        address indexed submitter,
        string dataPointer,
        uint256 stakeAmount
    );

    event ValidationStarted(
        uint256 indexed submissionId,
        uint256 validationDeadline
    );

    event VoteCast(
        uint256 indexed submissionId,
        address indexed validator,
        bool choice,
        uint256 stakeAmount
    );

    event ValidationFinalized(
        uint256 indexed submissionId,
        Status finalStatus,
        uint256 rewardAmount // 0 if rejected
    );

    event StakeReturned(address indexed recipient, uint256 amount);
    event StakeSlashed(address indexed staker, uint256 amount);

    // --- Errors --- //
    error InsufficientAllowance();
    error TransferFailed();
    error SubmissionNotFound();
    error WrongSubmissionStatus(Status expected, Status actual);
    error VotingPeriodNotOpen();
    error VotingPeriodOver();
    error AlreadyVoted();
    error ValidationNotReadyToFinalize();
    error ValidationAlreadyFinalized();
    error CalculationOverflow();
    error InvalidTreasuryAddress();

    // --- Constructor --- //

    constructor(
        address _rootTokenAddress,
        address _parametersAddress,
        address _treasuryAddress // The external address to receive slashed funds
    ) Ownable(msg.sender) {
        require(_rootTokenAddress != address(0), "Invalid ROOT address");
        require(_parametersAddress != address(0), "Invalid Parameters address");
        require(_treasuryAddress != address(0), "Invalid Treasury address");

        rootToken = IERC20(_rootTokenAddress);
        poplarParametersAddress = _parametersAddress;
        treasuryAddress = _treasuryAddress;
    }

    // --- Core Functions --- //

    /**
     * @notice Submits property data for validation.
     * @param dataPointer String identifying the off-chain data (e.g., IPFS CID).
     * @dev Requires the sender to have approved sufficient ROOT tokens.
     */
    function submitData(string memory dataPointer) external nonReentrant {
        uint256 sStake = IPoplarParameters(poplarParametersAddress).sStakeAmount();
        require(sStake > 0, "Submission stake not set");

        // Check allowance and transfer stake
        if (rootToken.allowance(msg.sender, address(this)) < sStake) {
            revert InsufficientAllowance();
        }
        rootToken.safeTransferFrom(msg.sender, address(this), sStake);

        // Create submission
        uint256 submissionId = nextSubmissionId;
        Submission storage sub = submissions[submissionId];
        sub.submitter = msg.sender;
        sub.dataPointer = dataPointer;
        sub.submissionTime = block.timestamp;
        sub.status = Status.PendingValidation;
        sub.submitterStake = sStake;

        nextSubmissionId = submissionId + 1; // Increment for next submission

        emit SubmissionReceived(submissionId, msg.sender, dataPointer, sStake);

        _startValidation(submissionId);
    }

    /**
     * @notice Allows a validator to cast a vote on a submission.
     * @param submissionId The ID of the submission to vote on.
     * @param voteChoice The validator's vote (true for Accept, false for Reject).
     * @dev Requires the sender to have approved sufficient ROOT tokens.
     */
    function castVote(uint256 submissionId, bool voteChoice) external nonReentrant {
        Submission storage sub = submissions[submissionId];
        if (sub.submitter == address(0)) revert SubmissionNotFound(); // Check if submission exists
        if (sub.status != Status.ValidationOpen) revert WrongSubmissionStatus(Status.ValidationOpen, sub.status);
        if (block.timestamp > sub.validationDeadline) revert VotingPeriodOver();

        mapping(address => Vote) storage submissionVoteMap = votes[submissionId];
        if (submissionVoteMap[msg.sender].stakeAmount > 0) revert AlreadyVoted();

        uint256 valStake = IPoplarParameters(poplarParametersAddress).valStakeAmount();
        require(valStake > 0, "Validation stake not set");

        // Check allowance and transfer stake
        if (rootToken.allowance(msg.sender, address(this)) < valStake) {
            revert InsufficientAllowance();
        }
        rootToken.safeTransferFrom(msg.sender, address(this), valStake);

        // Record vote
        submissionVoteMap[msg.sender] = Vote({ choice: voteChoice, stakeAmount: valStake, processed: false });
        submissionVoters[submissionId].push(msg.sender);

        if (voteChoice) {
            sub.totalYesStake = sub.totalYesStake + valStake;
        } else {
            sub.totalNoStake = sub.totalNoStake + valStake;
        }

        emit VoteCast(submissionId, msg.sender, voteChoice, valStake);
    }

    /**
     * @notice Finalizes the validation process for a submission after the deadline.
     * @param submissionId The ID of the submission to finalize.
     * @dev Can be called by anyone after the validation deadline.
     */
    function finalizeValidation(uint256 submissionId) external nonReentrant {
        Submission storage sub = submissions[submissionId];
        if (sub.submitter == address(0)) revert SubmissionNotFound();
        if (sub.status != Status.ValidationOpen) revert ValidationAlreadyFinalized(); // Use specific error
        if (block.timestamp <= sub.validationDeadline) revert ValidationNotReadyToFinalize();

        uint256 totalVoteStake = sub.totalYesStake + sub.totalNoStake;
        bool finalOutcome; // Default false (Reject)

        // Determine outcome
        if (totalVoteStake > 0) {
            // Calculate percentage using multiplication first to avoid precision loss
            uint256 yesPercentage = sub.totalYesStake * 100 / totalVoteStake;
            if (yesPercentage >= IPoplarParameters(poplarParametersAddress).consensusThresholdPercent()) {
                finalOutcome = true; // Accept
            }
        }
        // If totalVoteStake is 0, outcome remains false (Reject)

        uint256 rewardAmount = 0;
        if (finalOutcome) {
            // --- Process Acceptance --- //
            sub.status = Status.Validated;
            validatedPropertyCount = validatedPropertyCount + 1;

            // Calculate and mint reward
            rewardAmount = _calculateRewardS(sub.submitterStake);
            if (rewardAmount > 0) {
                try IRootToken(address(rootToken)).mint(sub.submitter, rewardAmount) {}
                catch { /* Handle potential mint failure? */ }
            }

            // Return submitter stake
            rootToken.safeTransfer(sub.submitter, sub.submitterStake);
            emit StakeReturned(sub.submitter, sub.submitterStake);

        } else {
            // --- Process Rejection --- //
            sub.status = Status.Rejected;

            // Slash submitter stake to the treasury address
            if (treasuryAddress == address(0)) revert InvalidTreasuryAddress();
            rootToken.safeTransfer(treasuryAddress, sub.submitterStake);
            emit StakeSlashed(sub.submitter, sub.submitterStake);
        }

        // Process validator stakes
        _processValidatorOutcomes(submissionId, finalOutcome);

        emit ValidationFinalized(submissionId, sub.status, rewardAmount);
    }

    // --- Internal Functions --- //

    /**
     * @notice Starts the validation period for a newly created submission.
     */
    function _startValidation(uint256 submissionId) internal {
        uint256 duration = IPoplarParameters(poplarParametersAddress).validationDurationSeconds();
        require(duration > 0, "Validation duration not set");
        submissions[submissionId].validationDeadline = block.timestamp + duration;
        submissions[submissionId].status = Status.ValidationOpen;
        emit ValidationStarted(submissionId, submissions[submissionId].validationDeadline);
    }

    /**
     * @notice Calculates the reward amount for a successful submission.
     * @dev Implements the formula: (InitialFactor * sStake) * (TargetProps / (TargetProps + N_validated))
     */
    function _calculateRewardS(uint256 _sStakeAmount) internal view returns (uint256) {
        uint256 initialFactor = IPoplarParameters(poplarParametersAddress).rewardInitialFactor();
        uint256 targetProps = IPoplarParameters(poplarParametersAddress).rewardTargetProperties();

        if (targetProps == 0 || initialFactor == 0 || _sStakeAmount == 0) {
            return 0;
        }

        // numerator = initialFactor * _sStakeAmount * targetProps
        uint256 numerator = initialFactor * _sStakeAmount * targetProps;

        // denominator = targetProps + validatedPropertyCount
        uint256 denominator = targetProps + validatedPropertyCount;

        if (denominator == 0) {
            return 0; // Avoid division by zero
        }

        return numerator / denominator;
    }

    /**
     * @notice Processes validator stakes based on the final validation outcome.
     * @dev Returns correct stakes, slashes incorrect stakes to the configured treasury address.
     * @dev Iterating through voters can be gas-intensive. Consider alternative patterns for large scale.
     */
    function _processValidatorOutcomes(uint256 submissionId, bool actualOutcome) internal {
        address[] storage voters = submissionVoters[submissionId];
        uint256 slashPercent = IPoplarParameters(poplarParametersAddress).slashingPenaltyPercent();
        if (treasuryAddress == address(0)) revert InvalidTreasuryAddress();

        for (uint i = 0; i < voters.length; i++) {
            address validator = voters[i];
            Vote storage v = votes[submissionId][validator];

            // Ensure vote hasn't been processed (safety against reentrancy, though guarded)
            if (!v.processed) {
                v.processed = true;
                uint256 stake = v.stakeAmount;

                if (v.choice == actualOutcome) {
                    // Correct vote: return stake
                    rootToken.safeTransfer(validator, stake);
                    emit StakeReturned(validator, stake);
                } else {
                    // Incorrect vote: slash stake
                    if (slashPercent > 0 && stake > 0) {
                        uint256 slashAmount = stake * slashPercent / 100;
                        uint256 returnAmount = stake - slashAmount;

                        if (slashAmount > 0) {
                             rootToken.safeTransfer(treasuryAddress, slashAmount);
                             emit StakeSlashed(validator, slashAmount);
                        }
                        if (returnAmount > 0) {
                            rootToken.safeTransfer(validator, returnAmount);
                            emit StakeReturned(validator, returnAmount);
                        }
                    } else {
                        // If slashPercent is 0, return full stake
                        rootToken.safeTransfer(validator, stake);
                        emit StakeReturned(validator, stake);
                    }
                }
            }
        }
    }

    // --- View Functions --- //

    /**
     * @notice Returns the list of addresses that voted on a specific submission.
     */
    function getVotersForSubmission(uint256 submissionId) external view returns (address[] memory) {
        return submissionVoters[submissionId];
    }
}
