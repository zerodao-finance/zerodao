// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.13;

import "./ERC4626Storage.sol";
import "./GovernableStorage.sol";
import "../utils/ModuleStateCoder.sol";
import "../utils/GlobalStateCoder.sol";
import "../utils/LoanRecordCoder.sol";

contract ZeroBTCStorage is ERC4626Storage, GovernableStorage {
  GlobalState internal _state;

  //percentage of profits wrt zerodao's share for keeper (is divided by 100)
  uint8 internal _keeperProfitsMultiplier;

  address internal _strategy;

  mapping(address => ModuleState) internal _moduleFees;

  // Maps loanId => LoanRecord
  mapping(uint256 => LoanRecord) internal _outstandingLoans;
}
