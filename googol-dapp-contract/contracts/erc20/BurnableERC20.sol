// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

import "../service/ServicePayer.sol";

/**
 * @title BurnableERC20
 * @dev Implementation of the BurnableERC20
 */
contract BurnableERC20 is ERC20Burnable, ServicePayer {
    uint8 private _decimals;

    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals_,
        uint256 initialBalance,
        address payable feeReceiver
    ) payable ERC20(name, symbol) ServicePayer(feeReceiver, "BurnableERC20") {
        require(initialBalance > 0, "BurnableERC20: supply cannot be zero");

        _decimals = decimals_;
        _mint(_msgSender(), initialBalance);
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
}
