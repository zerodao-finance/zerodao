// SPDX-License-Identifier: MIT

pragma solidity >=0.8.7 <0.9.0;

import { TimelockControllerUpgradeable } from "@openzeppelin/contracts-upgradeable/governance/TimelockControllerUpgradeable.sol";

contract ZeroTimelockController is TimelockControllerUpgradeable {
  function initialize(uint256 minDelay, address multisig) public initializer {
    address[] memory proposers = new address[](1);
    proposers[0] = multisig;
    __TimelockController_init_unchained(minDelay, proposers, proposers, msg.sender);
  }
}
