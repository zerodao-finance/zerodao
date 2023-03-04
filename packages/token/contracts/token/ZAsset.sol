// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

abstract contract ZAsset is ERC20Permit {
    uint256 public idx;
    function mint(address to, bytes32 pHash, bytes32 nHash, uint256 amount, bytes memory signature) public {
    // implementation for minting the wrapped asset
    _mint(to, amount);

   // updateZAssetReward(idx, amount);
  }

  function burn(uint256 amount, bytes memory blsPubKey, bytes memory data) public {
    // implementation for burning the wrapped asset
    address addr = address(bytes20(keccak256(blsPubKey)));
    _burn(addr, amount);
   
   
    // updateZAssetReward(idx, amount);
  }
}

 /* function updateZAssetReward(uint256 idx, uint256 amount) external {
    ZAsset storage zAsset = zassets[idx];
    require(msg.sender == address(zAsset.token));
    zAsset.rewardsToBeMinted = zAsset.rewardsToBeMinted.add(amount);
  } */