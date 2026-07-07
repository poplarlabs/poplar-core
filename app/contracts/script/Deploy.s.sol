// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "forge-std/Script.sol";
import "../src/RootToken.sol";
import "../src/PoplarParameters.sol";
import "../src/SubmissionValidation.sol";
import "./DeploymentManager.s.sol";

contract DeployScript is Script {
    // Test account address
    address constant TEST_ACCOUNT = 0x23829F8E89be39CE975b4B0b3EAE84CdfD3229F1;
    // Define the external treasury address (using TEST_ACCOUNT as an example)
    address constant EXTERNAL_TREASURY_ADDRESS = TEST_ACCOUNT;

    // Deployment manager to save addresses
    DeploymentManager public deploymentManager;

    function run() external {
        deploymentManager = new DeploymentManager();
        uint32 chainId = uint32(block.chainid);
        string memory networkString = vm.toString(chainId);

        // Use the private key provided via the command line flag
        vm.startBroadcast();

        // Deploy ROOT token (constructor takes no arguments)
        RootToken token = new RootToken();
        console.log("ROOT token deployed at:", address(token));
        deploymentManager.saveDeployment(networkString, "RootToken", address(token));

        // Deploy PoplarParameters with initial values
        PoplarParameters params = new PoplarParameters(
            100 * 10**18,    // sStakeAmount: 100 ROOT
            50 * 10**18,     // valStakeAmount: 50 ROOT
            66,              // consensusThresholdPercent: 66%
            7 days,          // validationDurationSeconds
            2,               // rewardInitialFactor
            1000,            // rewardTargetProperties
            10               // slashingPenaltyPercent: 10%
        );
        console.log("PoplarParameters deployed at:", address(params));
        deploymentManager.saveDeployment(networkString, "PoplarParameters", address(params));

        // Treasury deployment removed
        // // Deploy Treasury
        // Treasury treasury = new Treasury(address(token));
        // console.log("Treasury deployed at:", address(treasury));
        // deploymentManager.saveDeployment("Treasury", address(treasury), chainId);

        // Deploy SubmissionValidation with external treasury address
        console.log("Using external treasury address:", EXTERNAL_TREASURY_ADDRESS);
        SubmissionValidation subVal = new SubmissionValidation(
            address(token),
            address(params),
            EXTERNAL_TREASURY_ADDRESS // Pass the external address
        );
        console.log("SubmissionValidation deployed at:", address(subVal));
        deploymentManager.saveDeployment(networkString, "SubmissionValidation", address(subVal));

        // Transfer 1,000,000 ROOT tokens to test account
        token.mint(TEST_ACCOUNT, 1_000_000 * 10**18);
        console.log("Minted 1,000,000 ROOT to:", TEST_ACCOUNT);

        // Send 100 ETH to test account
        (bool sent, ) = TEST_ACCOUNT.call{value: 100 ether}("");
        require(sent, "Failed to send ETH");
        console.log("Sent 100 ETH to:", TEST_ACCOUNT);

        vm.stopBroadcast();

        // Save deployment info
        deploymentManager.saveDeployment(networkString, "DeploymentManager", address(deploymentManager));
    }
}
