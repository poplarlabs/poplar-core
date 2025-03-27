// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "forge-std/console.sol";

contract DeploymentManager is Script {
    string constant DEPLOYMENTS_PATH = "deployments/";

    function saveDeployment(string memory network, string memory contractName, address deployedAt) internal {
        string memory deploymentFile = string.concat(
            DEPLOYMENTS_PATH,
            network,
            "/",
            contractName,
            ".json"
        );

        string memory deploymentInfo = vm.serializeAddress(
            "deployment",
            "address",
            deployedAt
        );

        vm.writeFile(deploymentFile, deploymentInfo);
        console.log("Saved deployment info for %s on %s at %s", contractName, network, deployedAt);
    }

    function getDeployedAddress(string memory network, string memory contractName) internal view returns (address) {
        string memory deploymentFile = string.concat(
            DEPLOYMENTS_PATH,
            network,
            "/",
            contractName,
            ".json"
        );

        try vm.readFile(deploymentFile) returns (string memory json) {
            return vm.parseJsonAddress(json, "$.address");
        } catch {
            revert("Deployment not found");
        }
    }
}
