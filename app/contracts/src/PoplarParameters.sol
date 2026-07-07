// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PoplarParameters
 * @notice Stores and manages critical parameters for the Poplar protocol.
 * @dev Parameters can only be updated by the owner (e.g., a governance contract or multisig).
 */
contract PoplarParameters is Ownable {
    // --- Parameters --- //

    // Staking amounts (assuming 18 decimals for ROOT)
    uint256 public sStakeAmount; // Required stake for submission
    uint256 public valStakeAmount; // Required stake for validation vote

    // Validation settings
    uint256 public consensusThresholdPercent; // Stake-weighted percentage (e.g., 66 for 66%)
    uint256 public validationDurationSeconds; // Time allowed for validators to vote

    // Reward calculation parameters
    uint256 public rewardInitialFactor; // Multiplier for reward calculation (e.g., 2)
    uint256 public rewardTargetProperties; // Denominator factor for reward decay

    // Slashing settings
    uint256 public slashingPenaltyPercent; // Percentage of stake slashed for incorrect votes (0-100)

    // Parameters stored as constants or variables
    uint256 public constant SUBMISSION_STAKE_REQUIREMENT = 100 * 10**18; // Example: 100 ROOT tokens

    // --- Events --- //
    event ParameterUpdated(string indexed parameterName, uint256 newValue);

    // --- Constructor --- //
    constructor(
        uint256 _sStakeAmount,
        uint256 _valStakeAmount,
        uint256 _consensusThresholdPercent,
        uint256 _validationDurationSeconds,
        uint256 _rewardInitialFactor,
        uint256 _rewardTargetProperties,
        uint256 _slashingPenaltyPercent
    ) Ownable(msg.sender) {
        _updateSStakeAmount(_sStakeAmount);
        _updateValStakeAmount(_valStakeAmount);
        _updateConsensusThresholdPercent(_consensusThresholdPercent);
        _updateValidationDurationSeconds(_validationDurationSeconds);
        _updateRewardInitialFactor(_rewardInitialFactor);
        _updateRewardTargetProperties(_rewardTargetProperties);
        _updateSlashingPenaltyPercent(_slashingPenaltyPercent);
    }

    // --- Owner Functions for Updates --- //

    function updateSStakeAmount(uint256 _newAmount) external onlyOwner {
        _updateSStakeAmount(_newAmount);
    }

    function updateValStakeAmount(uint256 _newAmount) external onlyOwner {
        _updateValStakeAmount(_newAmount);
    }

    function updateConsensusThresholdPercent(uint256 _newPercent) external onlyOwner {
        require(_newPercent > 0 && _newPercent <= 100, "Threshold must be 1-100");
        _updateConsensusThresholdPercent(_newPercent);
    }

    function updateValidationDurationSeconds(uint256 _newDuration) external onlyOwner {
        _updateValidationDurationSeconds(_newDuration);
    }

    function updateRewardInitialFactor(uint256 _newFactor) external onlyOwner {
        _updateRewardInitialFactor(_newFactor);
    }

    function updateRewardTargetProperties(uint256 _newTarget) external onlyOwner {
        _updateRewardTargetProperties(_newTarget);
    }

    function updateSlashingPenaltyPercent(uint256 _newPercent) external onlyOwner {
        require(_newPercent <= 100, "Penalty cannot exceed 100");
        _updateSlashingPenaltyPercent(_newPercent);
    }

    // --- Internal Update Logic --- //

    function _updateSStakeAmount(uint256 _newAmount) internal {
        sStakeAmount = _newAmount;
        emit ParameterUpdated("sStakeAmount", _newAmount);
    }

    function _updateValStakeAmount(uint256 _newAmount) internal {
        valStakeAmount = _newAmount;
        emit ParameterUpdated("valStakeAmount", _newAmount);
    }

    function _updateConsensusThresholdPercent(uint256 _newPercent) internal {
        consensusThresholdPercent = _newPercent;
        emit ParameterUpdated("consensusThresholdPercent", _newPercent);
    }

    function _updateValidationDurationSeconds(uint256 _newDuration) internal {
        validationDurationSeconds = _newDuration;
        emit ParameterUpdated("validationDurationSeconds", _newDuration);
    }

    function _updateRewardInitialFactor(uint256 _newFactor) internal {
        rewardInitialFactor = _newFactor;
        emit ParameterUpdated("rewardInitialFactor", _newFactor);
    }

    function _updateRewardTargetProperties(uint256 _newTarget) internal {
        rewardTargetProperties = _newTarget;
        emit ParameterUpdated("rewardTargetProperties", _newTarget);
    }

    function _updateSlashingPenaltyPercent(uint256 _newPercent) internal {
        slashingPenaltyPercent = _newPercent;
        emit ParameterUpdated("slashingPenaltyPercent", _newPercent);
    }
}
