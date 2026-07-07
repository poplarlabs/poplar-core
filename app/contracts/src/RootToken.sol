// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RootToken is ERC20, Ownable {
    constructor() ERC20("ROOT", "ROOT") Ownable(msg.sender) {}

    /**
     * @notice Creates `amount` tokens and assigns them to `account`,
     * increasing the total supply.
     * @dev Must only be called by the contract owner (intended to be SubmissionValidation contract).
     * Emits a {Transfer} event with `from` set to the zero address.
     * Requirements:
     * - `account` cannot be the zero address.
     */
    function mint(address account, uint256 amount) public onlyOwner {
        _mint(account, amount);
    }
}
