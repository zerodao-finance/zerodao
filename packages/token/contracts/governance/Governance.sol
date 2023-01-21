// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorVotesUpgradeable.sol";

abstract contract Governance is GovernorVotesUpgradeable {
  function initialize(address _szero) public initializer {
    __GovernorVotes_init_unchained(IVotesUpgradeable(_szero));
  }
}
