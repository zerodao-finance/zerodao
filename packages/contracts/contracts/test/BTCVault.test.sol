pragma solidity ^0.8.15;
import "forge-std/Test.sol";
import { IGateway, IGatewayRegistry } from "../interfaces/IGatewayRegistry.sol";
import { IChainlinkOracle } from "../interfaces/IChainlinkOracle.sol";
import { ConvertWBTCMainnet as ConvertWBTC } from "../modules/mainnet/ConvertWBTC.sol";
import { TransparentUpgradeableProxy } from "@openzeppelin/contracts-new/proxy/transparent/TransparentUpgradeableProxy.sol";
import { ProxyAdmin } from "@openzeppelin/contracts-new/proxy/transparent/ProxyAdmin.sol";
import "../util/RenBtcEthConverter.sol";
import "../erc4626/interfaces/IRenBtcEthConverter.sol";
import "../erc4626/vault/ZeroBTC.sol";
import { ZeroBTCBase } from "../erc4626/vault/ZeroBTCBase.sol";

contract BTCVaultTest is Test {
  address constant renbtc = 0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D;
  uint256 mainnet;

  constructor() {}

  function initiateFork() public {
    mainnet = vm.createSelectFork(vm.rpcUrl("mainnet"));
  }

  function initializeDummy() internal returns (address) {
    return
      address(
        new ZeroBTC(
          IGatewayRegistry(0xe4b679400F0f267212D5D812B95f58C83243EE71),
          IChainlinkOracle(0xdeb288F737066589598e9214E782fa5A8eD689e8),
          IChainlinkOracle(0x169E633A2D1E6c10dD91238Ba11c4A708dfEF37C),
          IRenBtcEthConverter(address(0x0)),
          0,
          0,
          0,
          0,
          address(0x0),
          address(0x0),
          address(0x0)
        )
      );
  }

  function deployVault(address proxy, address converter) internal returns (address vault) {
    vault = address(
      new ZeroBTC(
        IGatewayRegistry(0xe4b679400F0f267212D5D812B95f58C83243EE71),
        IChainlinkOracle(0xdeb288F737066589598e9214E782fa5A8eD689e8),
        IChainlinkOracle(0x169E633A2D1E6c10dD91238Ba11c4A708dfEF37C),
        IRenBtcEthConverter(address(converter)),
        //cachetimetolive
        3600,
        //maxloanduration
        0,
        //targetethreserve
        1 ether,
        //maxgasprofitsharebips
        200.000,
        address(this),
        renbtc,
        proxy
      )
    );
  }

  function initializeProxy(address converter) internal returns (ZeroBTC proxy, ProxyAdmin admin) {
    admin = new ProxyAdmin();
    address dummy = initializeDummy();
    TransparentUpgradeableProxy _proxy = new TransparentUpgradeableProxy(
      dummy,
      address(admin),
      abi.encodeWithSelector(ZeroBTCBase.initialize.selector, address(this), 200, 200, 200, 200)
    );
    proxy = ZeroBTC(payable(address(_proxy)));
    address vault = deployVault(address(proxy), converter);
    admin.upgrade(_proxy, vault);
  }

  function test() public {
    initiateFork();
    RenBtcEthConverterMainnet converter = new RenBtcEthConverterMainnet();
    (ZeroBTC vault, ) = initializeProxy(address(converter));

    ConvertWBTC module = new ConvertWBTC(renbtc);
  }
}
