// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "forge-std/Test.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../src/SubmissionValidation.sol";
import "../src/RootToken.sol"; // Assuming this contains IRootToken interface
import "../src/PoplarParameters.sol"; // Assuming this contains IPoplarParameters interface

// --- Mock Contracts ---

contract MockRootToken is IERC20 {
    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowances;
    uint256 public totalSupply;
    string public name = "MockRoot";
    string public symbol = "mROOT";
    uint8 public decimals = 18;

    function mint(address to, uint256 amount) external {
        balances[to] += amount;
        totalSupply += amount;
        emit Transfer(address(0), to, amount);
    }

    function burn(address from, uint256 amount) external {
        require(balances[from] >= amount, "ERC20: burn amount exceeds balance");
        balances[from] -= amount;
        totalSupply -= amount;
        emit Transfer(from, address(0), amount);
    }

    function balanceOf(address account) external view override returns (uint256) {
        return balances[account];
    }

    function transfer(address recipient, uint256 amount) external override returns (bool) {
        require(balances[msg.sender] >= amount, "ERC20: transfer amount exceeds balance");
        balances[msg.sender] -= amount;
        balances[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function allowance(address owner, address spender) external view override returns (uint256) {
        return allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) external override returns (bool) {
        allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) external override returns (bool) {
        require(balances[sender] >= amount, "ERC20: transfer amount exceeds balance");
        require(allowances[sender][msg.sender] >= amount, "ERC20: transfer amount exceeds allowance");

        allowances[sender][msg.sender] -= amount;
        balances[sender] -= amount;
        balances[recipient] += amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }
}

// Simple mock implementing the IPoplarParameters interface
contract MockPoplarParameters is IPoplarParameters {
    uint256 private _sStakeAmount;
    uint256 private _valStakeAmount;
    uint256 private _consensusThresholdPercent;
    uint256 private _validationDurationSeconds;
    uint256 private _rewardInitialFactor;
    uint256 private _rewardTargetProperties;
    uint256 private _slashingPenaltyPercent;

    function setSStakeAmount(uint256 amount) external { _sStakeAmount = amount; }
    function setValStakeAmount(uint256 amount) external { _valStakeAmount = amount; }
    function setConsensusThresholdPercent(uint256 percent) external { _consensusThresholdPercent = percent; }
    function setValidationDurationSeconds(uint256 seconds) external { _validationDurationSeconds = seconds; }
    function setRewardInitialFactor(uint256 factor) external { _rewardInitialFactor = factor; }
    function setRewardTargetProperties(uint256 target) external { _rewardTargetProperties = target; }
    function setSlashingPenaltyPercent(uint256 percent) external { _slashingPenaltyPercent = percent; }


    function sStakeAmount() external view override returns (uint256) { return _sStakeAmount; }
    function valStakeAmount() external view override returns (uint256) { return _valStakeAmount; }
    function consensusThresholdPercent() external view override returns (uint256) { return _consensusThresholdPercent; }
    function validationDurationSeconds() external view override returns (uint256) { return _validationDurationSeconds; }
    function rewardInitialFactor() external view override returns (uint256) { return _rewardInitialFactor; }
    function rewardTargetProperties() external view override returns (uint256) { return _rewardTargetProperties; }
    function slashingPenaltyPercent() external view override returns (uint256) { return _slashingPenaltyPercent; }
}


// --- Test Contract ---

contract SubmissionValidationTest is Test {
    SubmissionValidation public submissionValidation;
    MockRootToken public rootToken;
    MockPoplarParameters public parameters;
    address public treasury;

    address public user1; // Submitter 1
    address public user2; // Submitter 2 / Validator 2
    address public validator1; // Validator 1

    uint256 constant ONE_ETHER = 1 ether; // For easier stake amounts

    function setUp() public {
        // Create mock contracts
        rootToken = new MockRootToken();
        parameters = new MockPoplarParameters();
        treasury = address(0xdead); // Dummy treasury address

        // Deploy the main contract
        submissionValidation = new SubmissionValidation(
            address(rootToken),
            address(parameters),
            treasury
        );

        // Create test users
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        validator1 = makeAddr("validator1");

        // Set initial parameters
        parameters.setSStakeAmount(100 * ONE_ETHER);      // 100 ROOT to submit
        parameters.setValStakeAmount(50 * ONE_ETHER);     // 50 ROOT to validate
        parameters.setConsensusThresholdPercent(66);    // 66% needed to validate
        parameters.setValidationDurationSeconds(1 days); // 1 day validation period
        parameters.setRewardInitialFactor(10);          // Example reward factor (adjust as needed)
        parameters.setRewardTargetProperties(1000);     // Example target properties (adjust as needed)
        parameters.setSlashingPenaltyPercent(50);       // 50% slash penalty

        // Mint some initial tokens (optional, can be done per test)
        // rootToken.mint(user1, 200 * ONE_ETHER);
        // rootToken.mint(validator1, 100 * ONE_ETHER);
    }

    // --- Test Cases ---

    function testBootstrapScenario() public {
        uint256 sStake = parameters.sStakeAmount();
        uint256 valStake = parameters.valStakeAmount();
        string memory dataPointer1 = "ipfs://data1";
        string memory dataPointer2 = "ipfs://data2";

        // 1. Mint initial stake ONLY for validator1
        rootToken.mint(validator1, valStake);
        assertEq(rootToken.balanceOf(user1), 0, "User1 should start with 0 ROOT");
        assertEq(rootToken.balanceOf(validator1), valStake, "Validator1 should have valStake");

        // 2. User1 tries to submit (should fail - no funds/allowance)
        vm.startPrank(user1);
        vm.expectRevert(bytes("ERC20: transfer amount exceeds balance")); // Or InsufficientAllowance if checking allowance first
        submissionValidation.submitData(dataPointer1);
        vm.stopPrank();

        // 3. Mint submission stake for User1
        rootToken.mint(user1, sStake);
        assertEq(rootToken.balanceOf(user1), sStake, "User1 should have sStake");

        // 4. User1 approves contract and submits data (Submission 0)
        vm.startPrank(user1);
        rootToken.approve(address(submissionValidation), sStake);
        assertEq(rootToken.allowance(user1, address(submissionValidation)), sStake, "Allowance incorrect");

        // Expect events for submission and validation start
        vm.expectEmit(true, true, true, true);
        emit SubmissionReceived(0, user1, dataPointer1, sStake);
        vm.expectEmit(true, false, false, true); // Check deadline later
        emit ValidationStarted(0, block.timestamp + parameters.validationDurationSeconds());

        submissionValidation.submitData(dataPointer1);
        vm.stopPrank();

        Submission memory sub0 = submissionValidation.submissions(0);
        assertEq(sub0.submitter, user1, "Submitter mismatch");
        assertEq(sub0.status, Status.ValidationOpen, "Status should be ValidationOpen");
        assertEq(sub0.submitterStake, sStake, "Submitter stake mismatch");
        assertEq(rootToken.balanceOf(address(submissionValidation)), sStake, "Contract balance incorrect after submission");
        assertEq(rootToken.balanceOf(user1), 0, "User1 balance incorrect after submission");

        // 5. Validator1 approves and votes 'Yes'
        vm.startPrank(validator1);
        rootToken.approve(address(submissionValidation), valStake);
        assertEq(rootToken.allowance(validator1, address(submissionValidation)), valStake, "Validator allowance incorrect");

        // Expect VoteCast event
        vm.expectEmit(true, true, false, true);
        emit VoteCast(0, validator1, true, valStake);

        submissionValidation.castVote(0, true);
        vm.stopPrank();

        sub0 = submissionValidation.submissions(0); // Re-fetch submission data
        assertEq(sub0.totalYesStake, valStake, "Yes stake mismatch");
        assertEq(rootToken.balanceOf(address(submissionValidation)), sStake + valStake, "Contract balance incorrect after vote");
        assertEq(rootToken.balanceOf(validator1), 0, "Validator1 balance incorrect after vote");

        // 6. Advance time past deadline
        vm.warp(block.timestamp + parameters.validationDurationSeconds() + 1);

        // 7. Finalize validation (anyone can call)
        // Calculate expected reward (N_validated = 0 before this finalization)
        uint256 initialFactor = parameters.rewardInitialFactor(); // 10
        uint256 targetProps = parameters.rewardTargetProperties(); // 1000
        uint256 expectedReward = (initialFactor * sStake * targetProps) / (targetProps + 0);
        // expectedReward = (10 * 100e18 * 1000) / (1000) = 1000e18

        // Expect events for finalization and stake returns
        vm.expectEmit(true, true, true, true); // StakeReturned for submitter
        emit StakeReturned(user1, sStake);
        vm.expectEmit(true, true, true, true); // StakeReturned for validator
        emit StakeReturned(validator1, valStake);
        vm.expectEmit(true, false, false, true); // ValidationFinalized
        emit ValidationFinalized(0, Status.Validated, expectedReward);

        submissionValidation.finalizeValidation(0);

        // 8. Verify balances after finalization
        assertEq(rootToken.balanceOf(user1), expectedReward, "User1 final balance incorrect (reward)");
        assertEq(rootToken.balanceOf(validator1), valStake, "Validator1 final balance incorrect (stake returned)");
        assertEq(rootToken.balanceOf(address(submissionValidation)), 0, "Contract final balance incorrect");
        assertEq(submissionValidation.validatedPropertyCount(), 1, "Validated count should be 1");

        // 9. Mint submission stake for User2
        rootToken.mint(user2, sStake);
        assertEq(rootToken.balanceOf(user2), sStake, "User2 should have sStake");

        // 10. User2 approves and submits data (Submission 1)
        vm.startPrank(user2);
        rootToken.approve(address(submissionValidation), sStake);

        // Expect events for submission and validation start
        vm.expectEmit(true, true, true, true);
        emit SubmissionReceived(1, user2, dataPointer2, sStake);
        vm.expectEmit(true, false, false, true); // Check deadline later
        emit ValidationStarted(1, block.timestamp + parameters.validationDurationSeconds());

        submissionValidation.submitData(dataPointer2);
        vm.stopPrank();

        // 11. Verify Submission 1 state
        Submission memory sub1 = submissionValidation.submissions(1);
        assertEq(sub1.submitter, user2, "Submitter 2 mismatch");
        assertEq(sub1.status, Status.ValidationOpen, "Status 2 should be ValidationOpen");
        assertEq(rootToken.balanceOf(address(submissionValidation)), sStake, "Contract balance incorrect after sub 2");
        assertEq(rootToken.balanceOf(user2), 0, "User2 balance incorrect after submission");
        assertEq(submissionValidation.nextSubmissionId(), 2, "Next submission ID incorrect");
    }
}
