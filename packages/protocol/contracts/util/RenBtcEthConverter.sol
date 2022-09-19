// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "../interfaces/CurvePools/ICurveInt128.sol";
import "../interfaces/IWETH.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@openzeppelin/contracts-new/token/ERC20/IERC20.sol";
import "forge-std/console2.sol";

contract RenBtcEthConverterMainnet {
  ICurveInt128 rencrv = ICurveInt128(0x93054188d876f558f4a66B2EF1d97d16eDf0895B);
  IERC20 constant renbtc = IERC20(0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D);
  IERC20 constant wbtc = IERC20(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599);
  IWETH constant weth = IWETH(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2);
  ISwapRouter constant router = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);

  constructor() {
    renbtc.approve(address(rencrv), ~uint256(1) << 2);
    wbtc.approve(address(router), ~uint256(1) << 2);
    weth.approve(address(router), ~uint256(1) << 2);
  }

  function convertToEth(uint256 minOut) public returns (uint256 amount) {
    uint256 wbtcAmount = wbtc.balanceOf(address(this));
    (bool success, ) = address(rencrv).call(
      abi.encodeWithSelector(rencrv.exchange.selector, 0, 1, renbtc.balanceOf(address(this)), 1)
    );
    require(success, "!curve");
    wbtcAmount = wbtc.balanceOf(address(this)) - wbtcAmount;
    console2.log(wbtcAmount);
    bytes memory path = abi.encodePacked(wbtc, uint24(500), weth);
    ISwapRouter.ExactInputParams memory params = ISwapRouter.ExactInputParams({
      recipient: address(this),
      deadline: block.timestamp + 1,
      amountIn: wbtcAmount,
      amountOutMinimum: minOut,
      path: path
    });
    amount = router.exactInput(params);
    console2.log(weth.balanceOf(address(this)), amount);
    weth.withdraw(amount);
    address payable sender = payable(msg.sender);
    sender.transfer(amount);
  }

  receive() external payable {
    // no-op
  }
}
