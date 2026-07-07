// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "forge-std/Script.sol";
import "../src/RootToken.sol";
import "../src/PoplarParameters.sol";
import "../src/SubmissionValidation.sol";
import "./DeploymentManager.s.sol";

contract CheckScript is Script {
    DeploymentManager internal deploymentManager;

    function run() external {
        deploymentManager = new DeploymentManager();
        uint32 chainId = uint32(block.chainid);
        string memory networkName = vm.toString(chainId);

        // --- Fetch Deployed Contract Addresses --- //
        address rootTokenAddr = deploymentManager.getDeployedAddress(networkName, "RootToken");
        address paramsAddr = deploymentManager.getDeployedAddress(networkName, "PoplarParameters");
        address subValAddr = deploymentManager.getDeployedAddress(networkName, "SubmissionValidation");

        require(rootTokenAddr != address(0), "RootToken address not found");
        require(paramsAddr != address(0), "PoplarParameters address not found");
        require(subValAddr != address(0), "SubmissionValidation address not found");

        // --- Instantiate Contracts --- //
        RootToken rootToken = RootToken(rootTokenAddr);
        PoplarParameters params = PoplarParameters(paramsAddr);
        SubmissionValidation subVal = SubmissionValidation(subValAddr);

        console.log("--- Checking Deployed Contracts ---");
        console.log("RootToken Address:", rootTokenAddr);
        console.log("PoplarParameters Address:", paramsAddr);
        console.log("SubmissionValidation Address:", subValAddr);

        // --- Check PoplarParameters --- //
        console.log("\n--- Checking PoplarParameters Values ---");
        console.log("sStakeAmount:", params.sStakeAmount());
        console.log("valStakeAmount:", params.valStakeAmount());
        console.log("consensusThresholdPercent:", params.consensusThresholdPercent());
        console.log("validationDurationSeconds:", params.validationDurationSeconds());
        console.log("rewardInitialFactor:", params.rewardInitialFactor());
        console.log("rewardTargetProperties:", params.rewardTargetProperties());
        console.log("slashingPenaltyPercent:", params.slashingPenaltyPercent());

        // --- Check SubmissionValidation Initial State --- //
        console.log("\n--- Checking SubmissionValidation Initial State ---");
        console.log("nextSubmissionId:", subVal.nextSubmissionId());
        console.log("validatedPropertyCount:", subVal.validatedPropertyCount());
        // Check associated contract addresses
        console.log("Associated RootToken:", address(subVal.rootToken()));
        console.log("Associated Parameters:", address(subVal.poplarParametersAddress()));

        // --- Check RootToken --- //
        console.log("\n--- Checking RootToken --- //");
        // Check test account balance (should have received some during deployment)
        address testAccount = 0x23829F8E89be39CE975b4B0b3EAE84CdfD3229F1;
        console.log("Test Account ROOT Balance:", rootToken.balanceOf(testAccount));
        console.log("Total Supply:", rootToken.totalSupply());

        console.log("\n--- Check Script Finished ---");
    }
}
