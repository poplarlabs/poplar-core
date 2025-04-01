// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/Poplar.sol";

contract CheckScript is Script {
    function run() external {
        // Get the deployed Poplar contract
        Poplar poplar = Poplar(0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0);

        // Check locations
        console.log("Checking locations...");

        // Check US
        bool usAllowed = poplar.isCountryAllowed("US");
        console.log("US allowed:", usAllowed);

        // Check Alabama
        bool alabamaAllowed = poplar.isRegionAllowed("US", "Alabama");
        console.log("Alabama allowed:", alabamaAllowed);

        // Check Baldwin County
        bool baldwinAllowed = poplar.isLocalityAllowed("US", "Alabama", "Baldwin County");
        console.log("Baldwin County allowed:", baldwinAllowed);

        // Check full location validation
        bool locationValid = poplar.isValidLocation("US", "Alabama", "Baldwin County");
        console.log("Full location valid:", locationValid);
    }
}
