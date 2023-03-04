/* // SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { ZAsset } from "./ZAsset.sol";

contract ZBTC is ZAsset {
  string public constant name = "ZBTC";
  string public constant symbol = "ZBTC";
  uint8 public constant decimals = 8;
  uint256 public totalSupply;

  constructor() public {
    totalSupply = 100000000 * (10 ** uint256(decimals));
  }

  function mint(address to, bytes32 pHash, bytes32 nHash, uint256 amount, bytes memory signature) public {
    // implementation for minting ZBTC
    require(msg.sender == address(this), "Only contract owner can mint ZBTC");
    require(amount > 0, "Cannot mint 0 or negative ZBTC");

    totalSupply = totalSupply.add(amount);
    _mint(to, amount);
  }

  function burn(address from, uint256 amount) public {
    // implementation for burning ZBTC
    require(from == msg.sender, "Only msg.sender can burn their own ZBTC");
    require(amount > 0, "Cannot burn 0 or negative ZBTC");

    totalSupply = totalSupply.sub(amount);
    _burn(from, amount);
  }
}
 */

 // SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { ZAsset } from "./ZAsset";

contract ZBTC is ZAsset {
    constructor(idx) {
        this.idx = idx;
    }
    
}