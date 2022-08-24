// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

import { BaseConvert } from "../BaseConvert.sol";
import { IRenCrvArbitrum } from "../../interfaces/CurvePools/IRenCrvArbitrum.sol";
import { SafeMath } from "@openzeppelin/contracts-new/utils/math/SafeMath.sol";
import { SafeERC20 } from "@openzeppelin/contracts-new/token/ERC20/utils/SafeERC20.sol";
import { IERC20 } from "@openzeppelin/contracts-new/token/ERC20/IERC20.sol";

contract ConvertWBTCArbitrum is BaseConvert {
  using SafeMath for *;
  using SafeERC20 for IERC20;
  uint256 constant _maxBurnGas = 10000;
  uint256 constant _maxLoanGas = 10000;
  uint256 constant _maxRepayGas = 10000;

  IRenCrvArbitrum constant renCrv = IRenCrvArbitrum(0x3E01dD8a5E1fb3481F0F589056b428Fc308AF0Fb);
  IERC20 constant wbtc = IERC20(0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f);

  constructor(address asset) BaseConvert(asset) {}

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
    amountOut = renCrv.exchange(1, 0, locals.amount, 1, address(this));
  }

  function swapBack(ConvertLocals memory locals) internal override returns (uint256 amountOut) {
    //no-op
  }

  function transfer(address to, uint256 amount) internal override {
    wbtc.transfer(to, amount);
  }
}
