// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { BaseConvert } from "../BaseConvert.sol";
import { ICurveInt128 } from "../../interfaces/CurvePools/ICurveInt128.sol";
import { SafeMath } from "@openzeppelin/contracts-new/utils/math/SafeMath.sol";
import { SafeERC20 } from "@openzeppelin/contracts-new/token/ERC20/utils/SafeERC20.sol";
import { IERC20 } from "@openzeppelin/contracts-new/token/ERC20/IERC20.sol";

contract ConvertWBTCMainnet is BaseConvert {
  using SafeMath for *;
  using SafeERC20 for IERC20;
  uint256 constant _maxBurnGas = 10000;
  uint256 constant _maxLoanGas = 10000;
  uint256 constant _maxRepayGas = 10000;

  ICurveInt128 constant renCrv = ICurveInt128(0x93054188d876f558f4a66B2EF1d97d16eDf0895B);
  IERC20 constant wbtc = IERC20(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599);

  constructor(address asset) BaseConvert(asset) {}

  function initialize() public override {
    IERC20(asset).approve(address(renCrv), ~uint256(1) << 2);
  }

  function maxBurnGas() public override returns (uint256) {
    return _maxBurnGas;
  }

  function maxRepayGas() public override returns (uint256) {
    return _maxLoanGas;
  }

  function maxLoanGas() public override returns (uint256) {
    return _maxRepayGas;
  }

  function swap(ConvertLocals memory locals) internal override returns (uint256 amountOut) {
    amountOut = renCrv.exchange(0, 1, locals.amount, 1);
  }

  function swapBack(ConvertLocals memory locals) internal override returns (uint256 amountOut) {
    //no-op
  }

  function transfer(address to, uint256 amount) internal override {
    wbtc.transfer(to, amount);
  }
}
