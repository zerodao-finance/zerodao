// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.8.7 <0.9.0;

import "forge-std/Test.sol";
import "../erc4626/vault/ZeroBTC.sol";
import { TransparentUpgradeableProxy } from "@openzeppelin/contracts-new/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import { ProxyAdmin } from "@openzeppelin/contracts-new/contracts/proxy/transparent/ProxyAdmin.sol";

contract ExistingVaultTest is Test {
  ProxyAdmin constant proxyAdmin = ProxyAdmin(0xFF727BDFa7608d7Fd12Cd2cDA1e7736ACbfCdB7B);
  address constant vault = 0x11DbF784098e296471A08251178F757156651085;
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
  address renBtcConverter = 0x60A81A16EF01Cc887f0A447f338fd664Fc7ad8B8;

  function setUp() public {
    address implementation = address(
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
        vault
      )
    );
    vm.prank(0x5E9B37149b7d7611bD0Eb070194dDA78EB11EfdC);
    proxyAdmin.upgrade(TransparentUpgradeableProxy(payable(vault)), implementation);
  }
  function testRepay() public {}
}
