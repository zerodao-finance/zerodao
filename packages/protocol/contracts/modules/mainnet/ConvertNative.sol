// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { BaseConvert } from "../BaseConvert.sol";
import { ICurveInt128 } from "../../interfaces/CurvePools/ICurveInt128.sol";
import { SafeMath } from "@openzeppelin/contracts-new/utils/math/SafeMath.sol";
import { SafeERC20 } from "@openzeppelin/contracts-new/token/ERC20/utils/SafeERC20.sol";
import { IERC20 } from "@openzeppelin/contracts-new/token/ERC20/IERC20.sol";
import { ISwapRouter } from "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import { IWETH } from "../../interfaces/IWETH.sol";
import { console2 as console } from "forge-std/console2.sol";

contract ConvertNativeMainnet is BaseConvert {
  using SafeMath for *;
  using SafeERC20 for IERC20;
  uint256 constant _maxBurnGas = 10000;
  uint256 constant _maxLoanGas = 10000;
  uint256 constant _maxRepayGas = 10000;

  address constant renCrv = 0x93054188d876f558f4a66B2EF1d97d16eDf0895B;
  address constant wbtc = 0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599;
  address constant weth = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
  address constant usdc = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
  uint24 constant wethWbtcFee = 500;
  uint24 constant usdcWethFee = 500;
  ISwapRouter constant routerV3 = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);

  constructor(address asset) BaseConvert(asset) {}

  function initialize() public override {
    IERC20(asset).approve(address(renCrv), ~uint256(1) << 2);
    IERC20(wbtc).approve(address(routerV3), ~uint256(1) << 2);
  }

  function swap(ConvertLocals memory locals) internal override returns (uint256 amountOut) {
    uint256 wbtcAmountOut = IERC20(wbtc).balanceOf(address(this));
    (bool success, ) = renCrv.call(abi.encodeWithSelector(ICurveInt128.exchange.selector, 0, 1, locals.amount, 1));
    require(success, "!curve wbtc");
    wbtcAmountOut = IERC20(wbtc).balanceOf(address(this)) - wbtcAmountOut;
    bytes memory path = abi.encodePacked(wbtc, wethWbtcFee, weth);
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
    console.log(amount);
  }
}