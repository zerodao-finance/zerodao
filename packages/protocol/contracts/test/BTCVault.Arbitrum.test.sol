pragma solidity >=0.8.13;
import "./Common.test.sol";
import { ConvertWBTCArbitrum } from "../modules/arbitrum/ConvertWBTC.sol";
import { ConvertUSDCArbitrum } from "../modules/arbitrum/ConvertUSDC.sol";
import { ConvertNativeArbitrum } from "../modules/arbitrum/ConvertNative.sol";

contract BTCVaultTestArbitrum is Common {
  constructor() {}

  function setUpNetwork() internal virtual override {
    renbtc = 0xDBf31dF14B66535aF65AaC99C32e9eA844e14501;
    wbtc = 0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f;
    usdc = 0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8;
    gateway = 0x05Cadbf3128BcB7f2b89F3dD55E5B0a036a49e20;
    rencrv = 0x3E01dD8a5E1fb3481F0F589056b428Fc308AF0Fb;
    btcEthOracle = 0xc5a90A6d7e4Af242dA238FFe279e9f2BA0c64B2e;
    gasPriceOracle = address(new BlockGasPriceOracle());
    moduleWBTC = address(new ConvertWBTCArbitrum(renbtc));
    moduleUSDC = address(new ConvertUSDCArbitrum(renbtc));
    moduleETH = address(new ConvertNativeArbitrum(renbtc));
    // @todo arbitrum version
    renBtcConverter = address(new RenBtcEthConverterMainnet());
  }

  function testMockGatewayLogic() public {
    require(IERC20(renbtc).balanceOf(address(this)) != 0, "not being minted");
  }

  function testModuleTypes() public {
    vault.addModule(moduleETH, ModuleType.LoanAndRepayOverride, 1000, 1000);
    vault.removeModule(moduleETH);
  }
}
