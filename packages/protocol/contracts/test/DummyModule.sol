// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { BaseConvert } from "../modules/BaseConvert.sol";

contract DummyModuleInitializeFail is BaseConvert {
  constructor(address asset) BaseConvert(asset) {}

  function initialize() public override {
    revert("test");
  }

  function swap(ConvertLocals memory locals) internal override returns (uint256 amountOut) {}

  function swapBack(ConvertLocals memory locals) internal override returns (uint256 amountOut) {
    //no-op
  }

  function transfer(address to, uint256 amount) internal override {}
}

contract DummyModuleSwapFail is BaseConvert {
  constructor(address asset) BaseConvert(asset) {}

  function initialize() public override {}

  function swap(ConvertLocals memory locals) internal override returns (uint256 amountOut) {
    revert("fail");
  }

  function swapBack(ConvertLocals memory locals) internal override returns (uint256 amountOut) {
    //no-op
  }

  function transfer(address to, uint256 amount) internal override {}
}

contract DummyModuleTransferFail is BaseConvert {
  constructor(address asset) BaseConvert(asset) {}

  function initialize() public override {}

  function swap(ConvertLocals memory locals) internal override returns (uint256 amountOut) {}

  function swapBack(ConvertLocals memory locals) internal override returns (uint256 amountOut) {
    //no-op
  }

  function transfer(address to, uint256 amount) internal override {
    revert("fail");
  }
}
