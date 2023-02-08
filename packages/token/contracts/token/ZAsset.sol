// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20Permit.sol";


contract ZAsset is ERC20Permit {
  function mint(address to, bytes32 pHash, bytes32 nHash, uint256 amount, bytes memory signature) public {
    // implementation for minting the wrapped asset
  }

  function burn(uint256 amount, bytes memory blsPubKey, bytes memory data) public {
    // implementation for burning the wrapped asset
  }
}