// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title GeneratorCopyright
 * @dev Implementation of the GeneratorCopyright
 */
 contract GeneratorCopyright {
   string private constant _GENERATOR = "Quinn by Googol Labs";
   string private _version;

  constructor (string memory version_) {
    _version = version_;
  }

  /**
  * @dev Returns the token generator tool.
  */
  function generator() public pure returns (string memory) {
    return _GENERATOR;
  }

  /**
  * @dev Returns the token generator tool.
  */
  function version() public view returns (string memory) {
    return _version;
  }
 }