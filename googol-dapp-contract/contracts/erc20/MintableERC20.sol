// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

import "./behaviours/ERC20Mintable.sol";
import "../service/ServicePayer.sol";

/**
 * @title MintableERC20
 * @dev Implementation of the MintableERC20
 */
contract MintableERC20 is ERC20Capped, ERC20Mintable, Ownable, ServicePayer {
    uint8 private _decimals;

    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals_,
        uint256 cap,
        uint256 initialBalance,
        address payable feeReceiver
    )
        payable
        ERC20(name, symbol)
        ERC20Capped(cap)
        ServicePayer(feeReceiver, "MintableERC20")
    {
        _decimals = decimals_;
        ERC20._mint(_msgSender(), initialBalance);
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
        override(ERC20, ERC20Capped)
        onlyOwner
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
