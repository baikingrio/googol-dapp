// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

import "./behaviours/ERC20Mintable.sol";
import "../access/Roles.sol";
import "../service/ServicePayer.sol";

/**
 * @title UnlimitedERC20
 * @dev Implementation of the UnlimitedERC20
 */
contract UnlimitedERC20 is
    ERC20Mintable,
    ERC20Burnable,
    Ownable,
    Roles,
    ServicePayer
{
    uint8 private _decimals;

    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals_,
        uint256 initialBalance,
        address payable feeReceiver
    ) payable ERC20(name, symbol) ServicePayer(feeReceiver, "UnlimitedERC20") {
        _decimals = decimals_;
        _mint(_msgSender(), initialBalance);
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    /**
     * @dev Function to mint tokens.
     *
     * NOTE: restricting access to owner only. See {ERC20Mintable-mint}.
     *
     * @param account The address that will receive the minted tokens
     * @param amount The amount of tokens to mint
     */
    function _mint(address account, uint256 amount)
        internal
        override
        onlyMinter
    {
        super._mint(account, amount);
    }

    /**
     * @dev Function to stop minting new tokens.
     *
     * NOTE: restricting access to owner only. See {ERC20Mintable-finishMinting}.
     */
    function _finishMinting() internal override onlyOwner {
        super._finishMinting();
    }
}
