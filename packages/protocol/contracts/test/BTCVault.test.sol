pragma solidity ^0.8.15;
import "forge-std/Test.sol";
import "forge-std/console.sol";
import { IGateway, IGatewayRegistry } from "../interfaces/IGatewayRegistry.sol";
import { IChainlinkOracle } from "../interfaces/IChainlinkOracle.sol";
import { ConvertWBTCMainnet as ConvertWBTC } from "../modules/mainnet/ConvertWBTC.sol";
import { TransparentUpgradeableProxy } from "@openzeppelin/contracts-new/proxy/transparent/TransparentUpgradeableProxy.sol";
import { ProxyAdmin } from "@openzeppelin/contracts-new/proxy/transparent/ProxyAdmin.sol";
import "@openzeppelin/contracts-new/token/ERC20/IERC20.sol";
import "../util/RenBtcEthConverter.sol";
import "../erc4626/interfaces/IRenBtcEthConverter.sol";
import "../erc4626/vault/ZeroBTC.sol";
import "../erc4626/utils/ModuleStateCoder.sol";
import { ZeroBTCBase } from "../erc4626/vault/ZeroBTCBase.sol";

contract BTCVaultTest is Test {
  address constant renbtc = 0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D;
  address constant gateway = 0xe4b679400F0f267212D5D812B95f58C83243EE71;
  address constant zerowallet = 0x0F4ee9631f4be0a63756515141281A3E2B293Bbe;
  uint256 mainnet;
  uint256 snapshot;
  ZeroBTC vault;
  ConvertWBTC module;

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

  function deployVault(address proxy, address converter) internal returns (address _vault) {
    _vault = address(
      new ZeroBTC(
        IGatewayRegistry(0xe4b679400F0f267212D5D812B95f58C83243EE71),
        IChainlinkOracle(0xdeb288F737066589598e9214E782fa5A8eD689e8),
        IChainlinkOracle(0x169E633A2D1E6c10dD91238Ba11c4A708dfEF37C),
        IRenBtcEthConverter(address(converter)),
        //cachetimetolive
        3600,
        //maxloanduration
        3600,
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
      abi.encodeWithSelector(ZeroBTCBase.initialize.selector, address(this), 200, 200, 200, 200, address(this))
    );
    proxy = ZeroBTC(payable(address(_proxy)));
    address _vault = deployVault(address(proxy), converter);
    admin.upgrade(_proxy, _vault);
  }

  function setUp() public {
    initiateFork();
    RenBtcEthConverterMainnet converter = new RenBtcEthConverterMainnet();
    (vault, ) = initializeProxy(address(converter));

    module = new ConvertWBTC(renbtc);
    vault.addModule(address(module), ModuleType.LoanOverride, 250, 250);
    bytes memory bytecode = (vm.getCode("MockGatewayLogicV1.sol"));
    address mockGateway;
    assembly {
      mockGateway := create(0, add(bytecode, 0x20), mload(bytecode))
    }
    vm.etch(gateway, mockGateway.code);
    assertEq0(gateway.code, mockGateway.code);
    gateway.call(abi.encodeWithSignature("setToken(address)", renbtc));
  }

  function testMockGatewayLogic() public {
    bytes memory sig;
    IGateway(gateway).mint(bytes32(0x0), 1000000.000, bytes32(0x0), sig);
    assertFalse(IERC20(renbtc).balanceOf(address(this)) == 0);
  }

  function testZeroLoan() public {
    bytes memory data;
    vault.loan(address(module), zerowallet, 1000.000, 1, data);
  }
}
