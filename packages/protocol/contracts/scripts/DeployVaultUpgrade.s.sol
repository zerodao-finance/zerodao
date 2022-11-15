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

contract DeployVaultUpgrade is Script {
  uint256 constant DefaultCacheTTL = 3600;
  uint256 constant DefaultMaxLoanDuration = 86400;
  uint256 constant DefaultTargetEthReserve = 1 ether;
  uint256 constant DefaultMaxGasProfitShareBips = 1000;
  uint256 constant DefaultZeroBorrowFeeBips = 800;
  uint256 constant DefaultRenBorrowFeeBips = 20;
  uint256 constant DefaultZeroBorrowFeeStatic = 1;
  uint256 constant DefaultRenBorrowFeeStatic = 1000;
  uint256 constant DefaultZeroFeeShareBips = 8000;
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
        0x5E9B37149b7d7611bD0Eb070194dDA78EB11EfdC,
        // asset
        renbtc,
        // proxy
        proxy
      )
    );
  }

  function deployProxy(address deployer, uint256 skip) internal returns (ZeroBTC _vault) {
    deployVaultImplementation(getDefaultCreateAddress(deployer, skip));
    TransparentUpgradeableProxy _proxy = new TransparentUpgradeableProxy(implementation, (proxyAdmin), "");
    _vault = ZeroBTC(payable(address(_proxy)));
  }

  function initializeProxy(
    address initialGovernance,
    address initialHarvester,
    address deployer
  ) internal {
    vault = deployProxy(deployer, 1);
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
    vm.createSelectFork(vm.rpcUrl("mainnet"));
    uint256 deployerKey = vm.envUint("PRIVATE_KEY");
    address deployer = vm.rememberKey(deployerKey);
    vm.startBroadcast(deployerKey);
    renBtcConverter = address(0x60A81A16EF01Cc887f0A447f338fd664Fc7ad8B8);
    moduleWBTC = address(0x7b0FF1Bfc3CeB27f5B37A7469F9dB14BFA4C58cF);
    moduleUSDC = address(0x3a50D292DBf7FDF3B91b313e16663F2494149C7c);
    moduleETH = address(0x6296821C06e422EE7D389f633F6a85a981A37Ba5);
    proxyAdmin = address(0xFF727BDFa7608d7Fd12Cd2cDA1e7736ACbfCdB7B);
    deployVaultImplementation(0x11DbF784098e296471A08251178F757156651085);
  }
}