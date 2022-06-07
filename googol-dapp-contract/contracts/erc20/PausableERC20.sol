// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";

import "../service/ServicePayer.sol";

/**
 * @title PausableERC20
 * @dev Implementation of the PausableERC20
 */
contract PausableERC20 is ERC20Pausable, Ownable, ServicePayer {
    uint8 private _decimals;

    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals_,
        uint256 initialBalance,
        address payable feeReceiver
    ) payable ERC20(name, symbol) ServicePayer(feeReceiver, "PausableERC20") {
        require(initialBalance > 0, "PausableERC20: supply cannot be zero");

        _decimals = decimals_;
        _mint(_msgSender(), initialBalance);
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
