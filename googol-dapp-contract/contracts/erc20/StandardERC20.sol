// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "../service/ServicePayer.sol";

/**
 * @title StandardERC20
 * @dev Implementation of the StandardERC20
 */
contract StandardERC20 is ERC20, ServicePayer {
    uint8 private _decimals;

    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals_,
        uint256 initialBalance,
        address payable feeReceiver
    ) payable ERC20(name, symbol) ServicePayer(feeReceiver, "StandardERC20") {
        require(initialBalance > 0, "StandardERC20: supply cannot be zero");

        _decimals = decimals_;
        _mint(_msgSender(), initialBalance);
    }
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
}
