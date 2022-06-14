// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "../service/ServicePayer.sol";
import "../utils/GeneratorCopyright.sol";

error SupplyCannotBeZero();

/**
 * @title SimpleERC20
 * @dev Implementation of the SimpleERC20
 */
contract SimpleERC20 is ERC20, ServicePayer, GeneratorCopyright("v1.0.0") {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialBalance,
        address payable feeReceiver
    ) payable ERC20(name, symbol) ServicePayer(feeReceiver, "SimpleERC20") {
        if (initialBalance <= 0) {
            revert SupplyCannotBeZero();
        }
        _mint(_msgSender(), initialBalance);
    }
}
