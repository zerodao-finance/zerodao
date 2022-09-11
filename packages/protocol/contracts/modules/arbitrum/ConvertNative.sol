// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { BaseConvert } from "../BaseConvert.sol";
import { IRenCrvArbitrum } from "../../interfaces/CurvePools/IRenCrvArbitrum.sol";
import { SafeMath } from "@openzeppelin/contracts-new/utils/math/SafeMath.sol";
import { SafeERC20 } from "@openzeppelin/contracts-new/token/ERC20/utils/SafeERC20.sol";
import { IERC20 } from "@openzeppelin/contracts-new/token/ERC20/IERC20.sol";
import { ISwapRouter } from "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import { IWETH } from "../../interfaces/IWETH.sol";

contract ConvertNativeArbitrum is BaseConvert {
  using SafeMath for *;
  using SafeERC20 for IERC20;
  uint256 constant _maxBurnGas = 10000;
  uint256 constant _maxLoanGas = 10000;
  uint256 constant _maxRepayGas = 10000;

  IRenCrvArbitrum constant renCrv = IRenCrvArbitrum(0x3E01dD8a5E1fb3481F0F589056b428Fc308AF0Fb);
  address constant wbtc = 0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f;
  address constant weth = 0x82aF49447D8a07e3bd95BD0d56f35241523fBab1;
  address constant usdc = 0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8;
  uint24 constant wethWbtcFee = 500;
  uint24 constant usdcWethFee = 500;
  ISwapRouter constant routerV3 = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);

  constructor(address asset) BaseConvert(asset) {}

  function initialize() public override {
    IERC20(asset).approve(address(renCrv), ~uint256(1) << 2);
    IERC20(wbtc).approve(address(routerV3), ~uint256(1) << 2);
  }

  function swap(ConvertLocals memory locals) internal override returns (uint256 amountOut) {
    uint256 wbtcAmountOut = renCrv.exchange(1, 0, locals.amount, 1, address(this));
    bytes memory path = abi.encodePacked(wbtc, wethWbtcFee, address(weth));
    ISwapRouter.ExactInputParams memory params = ISwapRouter.ExactInputParams({
      recipient: address(this),
      deadline: block.timestamp + 1,
      amountIn: wbtcAmountOut,
      amountOutMinimum: locals.minOut,
      path: path
    });
    amountOut = routerV3.exactInput(params);
    IWETH(weth).withdraw(amountOut);
  }

  function swapBack(ConvertLocals memory locals) internal override returns (uint256 amountOut) {
    //no-op
  }

  function transfer(address _to, uint256 amount) internal override {
    address payable to = payable(_to);
    to.transfer(amount);
  }
}