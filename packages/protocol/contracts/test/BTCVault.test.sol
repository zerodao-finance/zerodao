pragma solidity ^0.8.15;
import "forge-std/Test.sol";
import "forge-std/console.sol";
import { IGateway, IGatewayRegistry } from "../interfaces/IGatewayRegistry.sol";
import { IChainlinkOracle } from "../interfaces/IChainlinkOracle.sol";
import { ConvertWBTCMainnet as ConvertWBTC } from "../modules/mainnet/ConvertWBTC.sol";
import { ConvertUSDCMainnet as ConvertUSDC } from "../modules/mainnet/ConvertUSDC.sol";
import { ConvertNativeMainnet as ConvertETH } from "../modules/mainnet/ConvertNative.sol";
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
  address constant wbtc = 0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599;
  address constant usdc = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
  address constant gateway = 0xe4b679400F0f267212D5D812B95f58C83243EE71;
  address constant zerowallet = 0x0F4ee9631f4be0a63756515141281A3E2B293Bbe;
  address constant rencrv = 0x93054188d876f558f4a66B2EF1d97d16eDf0895B;
  address moduleDummy;
  uint256 mainnet;
  uint256 snapshot;
  ZeroBTC vault;
  ConvertWBTC moduleWBTC;
  ConvertUSDC moduleUSDC;
  ConvertETH moduleETH;

  constructor() {}

  function initiateFork() public {
    mainnet = vm.createSelectFork(vm.rpcUrl("mainnet"));
  }

  function initializeDummy() internal returns (address) {
    return
      address(
        new ZeroBTC(
          IGatewayRegistry(0xf36666C230Fa12333579b9Bd6196CB634D6BC506),
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
        IGatewayRegistry(0xf36666C230Fa12333579b9Bd6196CB634D6BC506),
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
    proxy = ZeroBTC(payable(address(_vault)));
    ZeroBTCBase(payable(address(proxy))).initialize(address(this), 200, 200, 200, 200, address(this));
  }

  function setUp() public {
    initiateFork();
    RenBtcEthConverterMainnet converter = new RenBtcEthConverterMainnet();
    (vault, ) = initializeProxy(address(converter));

    moduleWBTC = new ConvertWBTC(renbtc);
    moduleDummy = address(new ConvertWBTC(renbtc));
    moduleUSDC = new ConvertUSDC(renbtc);
    moduleETH = new ConvertETH(renbtc);
    vault.addModule(address(moduleWBTC), ModuleType.LoanOverride, 181e3, 82e3);
    vault.addModule(address(moduleUSDC), ModuleType.LoanOverride, 181e3, 82e3);
    vault.addModule(address(moduleETH), ModuleType.LoanOverride, 181e3, 82e3);
    vault.addModule(address(0x0), ModuleType.Null, 1000, 1000);
    bytes memory bytecode = (vm.getCode("MockGatewayLogicV1.sol"));
    address mockGateway;
    assembly {
      mockGateway := create(0, add(bytecode, 0x20), mload(bytecode))
    }
    vm.etch(gateway, mockGateway.code);
    assertEq0(gateway.code, mockGateway.code);
    gateway.call(abi.encodeWithSignature("setToken(address)", renbtc));
    bytes memory sig;
    IGateway(gateway).mint(bytes32(0x0), 1000000000, bytes32(0x0), sig);
    IERC20(renbtc).approve(address(vault), ~uint256(1) << 2);
    vm.deal(address(vault), 10 ether);
    vault.deposit(10000000, address(this));
  }

  function getBalance(address module) public returns (uint256) {
    if (module == address(moduleWBTC)) {
      return IERC20(wbtc).balanceOf(zerowallet);
    } else if (module == address(moduleUSDC)) {
      return IERC20(usdc).balanceOf(zerowallet);
    } else if (module == address(moduleETH)) {
      return zerowallet.balance;
    } else {
      return IERC20(renbtc).balanceOf(zerowallet);
    }
  }

  modifier checkBalance(address module) {
    uint256 balance = getBalance(module);
    _;
    require(getBalance(module) > balance, "tokens not generated");
    console.log("tokens generated", getBalance(module) - balance);
  }

  function testMockGatewayLogic() public {
    assertFalse(IERC20(renbtc).balanceOf(address(this)) == 0);
  }

  function zeroLoan(address module) public checkBalance(module) {
    bytes memory data;
    vault.loan(address(module), zerowallet, 1000000, 1, data);
    bytes memory sig;
    vault.repay(address(module), zerowallet, 1000000, 1, data, address(this), bytes32(0), sig);
  }

  function testModuleTypes() public {
    vault.addModule(moduleDummy, ModuleType.LoanAndRepayOverride, 1000, 1000);
    vault.removeModule(moduleDummy);
  }

  function testZeroLoanRenBTC() public {
    zeroLoan(address(0x0));
  }

  function testZeroLoanWBTC() public {
    zeroLoan(address(moduleWBTC));
  }

  function testZeroLoanUSDC() public {
    zeroLoan(address(moduleUSDC));
  }

  function testZeroLoanETH() public {
    zeroLoan(address(moduleETH));
  }

  function testExpiry() public {
    bytes memory data;
    vault.loan(address(0x0), zerowallet, 1000000, 1, data);
    vm.warp(block.timestamp + 3601);
    vault.closeExpiredLoan(address(0x0), zerowallet, 1000000, 1, data, address(this));
  }
}
