// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

import { BaseModule } from "../erc4626/BaseModule.sol";
import { console2 as console } from "forge-std/console2.sol";

abstract contract BaseConvert is BaseModule {
  constructor(address asset) BaseModule(asset) {}

  function _receiveLoan(
    address borrower,
    uint256 amount,
    uint256 nonce,
    bytes calldata data
  ) internal override returns (uint256 collateralIssued) {
    ConvertLocals memory locals;
    locals.borrower = borrower;
    locals.amount = amount;
    if (data.length > 0) (locals.minOut) = abi.decode(data, (uint256));
    console.log("swapping");
    collateralIssued = swap(locals);
    console.log("swapped");
    transfer(borrower, amount);
    console.log("transferred");
  }

  function _repayLoan(
    address,
    uint256,
    uint256,
    bytes calldata
  ) internal override returns (uint256) {
    //no-op
    return 0;
  }
}
