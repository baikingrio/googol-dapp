// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "../service/ServicePayer.sol";
import "../utils/GeneratorCopyright.sol";

contract HelloERC20 is ERC20, ServicePayer, GeneratorCopyright("v1.0.0") {
  constructor (
    string memory name,
    string memory symbol,
    address payable feeReceiver
  )
    ERC20(name, symbol)
    ServicePayer(feeReceiver, "HelloERC20")
    payable
  {
    _mint(_msgSender(), 10000 * 10 ** decimals());
  }
}