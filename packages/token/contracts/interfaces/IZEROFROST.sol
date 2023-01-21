// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IZEROFROST {
  function epoch() external returns (uint256);

  function nextEpoch() external returns (uint256);
}
