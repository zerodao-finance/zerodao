// SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;
import "forge-std/Script.sol";
import "../erc4626/vault/ZeroBTC.sol";
import { IGateway, IGatewayRegistry } from "../interfaces/IGatewayRegistry.sol";
import { IChainlinkOracle } from "../interfaces/IChainlinkOracle.sol";
import { ConvertWBTCMainnet } from "../modules/mainnet/ConvertWBTC.sol";
import { ConvertUSDCMainnet } from "../modules/mainnet/ConvertUSDC.sol";
import { ConvertNativeMainnet } from "../modules/mainnet/ConvertNative.sol";
import { RenBtcEthConverterMainnet } from "../util/RenBtcEthConverter.sol";
import { TransparentUpgradeableProxy } from "@openzeppelin/contracts-new/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import { ProxyAdmin } from "@openzeppelin/contracts-new/contracts/proxy/transparent/ProxyAdmin.sol";
import "../erc4626/interfaces/IRenBtcEthConverter.sol";
import { BlockGasPriceOracle } from "../erc4626/utils/BlockGasPriceOracle.sol";
import "forge-std/console2.sol";

contract DeployVault is Script {
  uint256 constant DefaultCacheTTL = 3600;
  uint256 constant DefaultMaxLoanDuration = 3600;
  uint256 constant DefaultTargetEthReserve = 1 ether;
  uint256 constant DefaultMaxGasProfitShareBips = 200.000;
  uint256 constant DefaultZeroBorrowFeeBips = 200;
  uint256 constant DefaultRenBorrowFeeBips = 200;
  uint256 constant DefaultZeroBorrowFeeStatic = 200;
  uint256 constant DefaultRenBorrowFeeStatic = 200;
  uint256 constant DefaultZeroFeeShareBips = 200;
  uint256 constant MaxUintApprove = ~uint256(0) >> 2;

  // Tokens
  address renbtc = 0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D;
  address wbtc = 0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599;
  address usdc = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
  address rencrv = 0x93054188d876f558f4a66B2EF1d97d16eDf0895B;

  // Ren addresses
  address gateway = 0xe4b679400F0f267212D5D812B95f58C83243EE71;
  address gatewayRegistry = 0xf36666C230Fa12333579b9Bd6196CB634D6BC506;

  // Oracles
  address btcEthOracle = 0xdeb288F737066589598e9214E782fa5A8eD689e8;
  address gasPriceOracle = 0x169E633A2D1E6c10dD91238Ba11c4A708dfEF37C;

  ZeroBTC vault;
  address renBtcConverter;
  address proxyAdmin;
  address implementation;
  address moduleWBTC;
  address moduleUSDC;
  address moduleETH;

  /**
   * @dev Get future address for contract deployed with create
   * @param deployer address that will deploy the contract
   * @param skip number of future deployments to skip, e.g. 1 gets second next address
   */
  function getDefaultCreateAddress(address deployer, uint256 skip) internal returns (address) {
    uint256 nonce = vm.getNonce(deployer) + skip;
    bytes memory data;

    if (nonce == 0x00) data = abi.encodePacked(uint8(0xd6), uint8(0x94), deployer, uint8(0x80));
    else if (nonce <= 0x7f) data = abi.encodePacked(uint8(0xd6), uint8(0x94), deployer, uint8(nonce));
    else if (nonce <= 0xff) data = abi.encodePacked(uint8(0xd7), uint8(0x94), deployer, uint8(0x81), uint8(nonce));
    else if (nonce <= 0xffff) data = abi.encodePacked(uint8(0xd8), uint8(0x94), deployer, uint8(0x82), uint16(nonce));
    else if (nonce <= 0xffffff) data = abi.encodePacked(uint8(0xd9), uint8(0x94), deployer, uint8(0x83), uint24(nonce));
    else data = abi.encodePacked(uint8(0xda), uint8(0x94), deployer, uint8(0x84), uint32(nonce));
    return address(uint160(uint256(keccak256(data))));
  }

  function deployVaultImplementation(address proxy) internal {
    implementation = address(
      new ZeroBTC(
        IGatewayRegistry(gatewayRegistry),
        IChainlinkOracle(btcEthOracle),
        IChainlinkOracle(gasPriceOracle),
        IRenBtcEthConverter(renBtcConverter),
        // cacheTimeToLive
        DefaultCacheTTL,
        // maxLoanDuration
        DefaultMaxLoanDuration,
        // targetEthReserve
        DefaultTargetEthReserve,
        // maxGasProfitShareBips
        DefaultMaxGasProfitShareBips,
        // zeroFeeRecipient
        address(this),
        // asset
        renbtc,
        // proxy
        proxy
      )
    );
  }

  function deployProxy(uint256 skip) internal returns (ZeroBTC _vault) {
    deployVaultImplementation(getDefaultCreateAddress(address(this), skip));
    TransparentUpgradeableProxy _proxy = new TransparentUpgradeableProxy(implementation, (proxyAdmin), "");
    _vault = ZeroBTC(payable(address(_proxy)));
  }

  function initializeProxy(address initialGovernance, address initialHarvester) internal {
    vault = deployProxy(1);
    vault.initialize(
      // initialGovernance
      initialGovernance,
      DefaultZeroBorrowFeeBips,
      DefaultRenBorrowFeeBips,
      DefaultZeroBorrowFeeStatic,
      DefaultRenBorrowFeeStatic,
      DefaultZeroFeeShareBips,
      initialHarvester
    );
  }

  function run() external {
    uint256 deployerKey = vm.envUint("PRIVATE_KEY");
    address deployer = vm.rememberKey(deployerKey);
    vm.startBroadcast(deployerKey);
    renBtcConverter = address(new RenBtcEthConverterMainnet());
    RenBtcEthConverterMainnet(payable(renBtcConverter)).initialize();
    moduleWBTC = address(new ConvertWBTCMainnet(renbtc));
    moduleUSDC = address(new ConvertUSDCMainnet(renbtc));
    moduleETH = address(new ConvertNativeMainnet(renbtc));
    proxyAdmin = address(new ProxyAdmin());
    initializeProxy(deployer, deployer);
    vault.addModule(address(moduleWBTC), ModuleType.LoanOverride, 181e3, 82e3);
    vault.addModule(address(moduleUSDC), ModuleType.LoanOverride, 330e3, 82e3);
    vault.addModule(address(moduleETH), ModuleType.LoanOverride, 257e3, 82e3);
    vault.addModule(address(0x0), ModuleType.Null, 84e3, 83e3);
    vault.authorize(deployer);
  }
}
