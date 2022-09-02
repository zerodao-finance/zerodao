// SPDX-License-Identifier: MIT

pragma solidity >=0.8.7 <0.9.0;

contract BlockGasPriceOracle {
  // contract only exists to return tx.gasprice for queries
  constructor() {}

  function latestAnswer() public returns (uint256) {
    return tx.gasprice;
  }
}
