// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/RootToken.sol";
import "../src/Poplar.sol";

contract DeployScript is Script {
    // Test account address
    address constant TEST_ACCOUNT = 0x23829F8E89be39CE975b4B0b3EAE84CdfD3229F1;

    function run() external {
        // Use Anvil's first test account private key
        uint256 deployerPrivateKey = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
        vm.startBroadcast(deployerPrivateKey);

        // Deploy ROOT token with initial supply
        RootToken token = new RootToken(100_000_000 * 10**18);
        console.log("ROOT token deployed at:", address(token));

        // Deploy Poplar contract
        Poplar poplar = new Poplar(address(token));
        console.log("Poplar contract deployed at:", address(poplar));

        // Transfer 100 ROOT tokens to test account
        token.transfer(TEST_ACCOUNT, 1_000_000 * 10**18);
        console.log("Transferred 1000000 ROOT to:", TEST_ACCOUNT);

        // Send 100 ETH to test account
        (bool sent, ) = TEST_ACCOUNT.call{value: 100 ether}("");
        require(sent, "Failed to send ETH");
        console.log("Sent 100 ETH to:", TEST_ACCOUNT);

        vm.stopBroadcast();
    }
}
