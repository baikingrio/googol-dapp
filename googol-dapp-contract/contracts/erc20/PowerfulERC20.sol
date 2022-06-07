// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "erc-payable-token/contracts/token/ERC1363/ERC1363.sol";
import "eth-token-recover/contracts/TokenRecover.sol";

import "./behaviours/ERC20Mintable.sol";
import "../access/Roles.sol";
import "../service/ServicePayer.sol";

/**
 * @title PowerfulERC20
 * @dev Implementation of the PowerfulERC20
 */
contract PowerfulERC20 is
    ERC20Capped,
    ERC20Mintable,
    ERC20Burnable,
    ERC1363,
    TokenRecover,
    Roles,
    ServicePayer
{
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
        ServicePayer(feeReceiver, "PowerfulERC20")
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
     * NOTE: restricting access to addresses with MINTER role. See {ERC20Mintable-mint}.
     *
     * @param account The address that will receive the minted tokens
     * @param amount The amount of tokens to mint
     */
    function _mint(address account, uint256 amount)
        internal
        override(ERC20, ERC20Capped)
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

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(AccessControl, ERC1363)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
