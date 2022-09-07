// SPDX-License-Identifier: MIT

pragma solidity >=0.8.7 <0.9.0;
import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../erc4626/vault/ZeroBTC.sol";
import { IGateway, IGatewayRegistry } from "../interfaces/IGatewayRegistry.sol";
import { IChainlinkOracle } from "../interfaces/IChainlinkOracle.sol";
import "../modules/mainnet/ConvertWBTC.sol";
import "../modules/mainnet/ConvertUSDC.sol";
import { ConvertNativeMainnet } from "../modules/mainnet/ConvertNative.sol";
import "../modules/arbitrum/ConvertWBTC.sol";
import "../modules/arbitrum/ConvertUSDC.sol";
import { ConvertNativeArbitrum } from "../modules/arbitrum/ConvertNative.sol";
import { TransparentUpgradeableProxy } from "@openzeppelin/contracts-new/proxy/transparent/TransparentUpgradeableProxy.sol";
import { ProxyAdmin } from "@openzeppelin/contracts-new/proxy/transparent/ProxyAdmin.sol";
import "@openzeppelin/contracts-new/token/ERC20/IERC20.sol";
import "../util/RenBtcEthConverter.sol";
import "../erc4626/interfaces/IRenBtcEthConverter.sol";
import "../erc4626/vault/ZeroBTC.sol";
import "../erc4626/utils/ModuleStateCoder.sol";
import { ZeroBTCBase } from "../erc4626/vault/ZeroBTCBase.sol";
import { BlockGasPriceOracle } from "../erc4626/utils/BlockGasPriceOracle.sol";
import { Dummy } from "../util/DummyImpl.sol";

contract Common is Test {
  address renbtc;
  address usdc;
  address wbtc;
  address rencrv;
  address gateway;
  address zerowallet;
  address moduleDummy;
  address moduleWBTC;
  address moduleUSDC;
  address gatewayRegistry;
  address btcEthOracle;
  address gasPriceOracle;
  address moduleETH;
  uint256 mainnet;
  uint256 snapshot;
  ZeroBTC vault;

  function initiateMainnetFork() public {
    mainnet = vm.createSelectFork(vm.rpcUrl("mainnet"));
    renbtc = 0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D;
    wbtc = 0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599;
    usdc = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    gateway = 0xe4b679400F0f267212D5D812B95f58C83243EE71;
    zerowallet = 0x0F4ee9631f4be0a63756515141281A3E2B293Bbe;
    rencrv = 0x93054188d876f558f4a66B2EF1d97d16eDf0895B;
    gatewayRegistry = 0xf36666C230Fa12333579b9Bd6196CB634D6BC506;
    btcEthOracle = 0xdeb288F737066589598e9214E782fa5A8eD689e8;
    gasPriceOracle = 0x169E633A2D1E6c10dD91238Ba11c4A708dfEF37C;
    moduleWBTC = address(new ConvertWBTCMainnet(renbtc));
    moduleDummy = address(new ConvertWBTCMainnet(renbtc));
    moduleUSDC = address(new ConvertUSDCMainnet(renbtc));
    moduleETH = address(new ConvertNativeMainnet(renbtc));
  }

  function initiateArbitrumFork() public {
    mainnet = vm.createSelectFork(vm.rpcUrl("arbitrum"));
    renbtc = 0xDBf31dF14B66535aF65AaC99C32e9eA844e14501;
    wbtc = 0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f;
    usdc = 0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8;
    gateway = 0x05Cadbf3128BcB7f2b89F3dD55E5B0a036a49e20;
    zerowallet = 0x0F4ee9631f4be0a63756515141281A3E2B293Bbe;
    rencrv = 0x3E01dD8a5E1fb3481F0F589056b428Fc308AF0Fb;
    gatewayRegistry = 0xf36666C230Fa12333579b9Bd6196CB634D6BC506;
    btcEthOracle = 0xc5a90A6d7e4Af242dA238FFe279e9f2BA0c64B2e;
    gasPriceOracle = address(new BlockGasPriceOracle());
    moduleWBTC = address(new ConvertWBTCArbitrum(renbtc));
    moduleDummy = address(new ConvertWBTCArbitrum(renbtc));
    moduleUSDC = address(new ConvertUSDCArbitrum(renbtc));
    moduleETH = address(new ConvertNativeArbitrum(renbtc));
  }

  function initializeDummy() internal returns (address) {
    return address(new Dummy());
  }

  function deployVault(address proxy, address converter) internal returns (address _vault) {
    _vault = address(
      new ZeroBTC(
        IGatewayRegistry(gatewayRegistry),
        IChainlinkOracle(btcEthOracle),
        IChainlinkOracle(gasPriceOracle),
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
    bytes memory _data;
    TransparentUpgradeableProxy _proxy = new TransparentUpgradeableProxy(dummy, address(admin), _data);
    proxy = ZeroBTC(payable(address(_proxy)));
    address _vault = deployVault(address(proxy), converter);
    admin.upgrade(_proxy, _vault);
    proxy = ZeroBTC(payable(address(_vault)));
    ZeroBTCBase(payable(address(proxy))).initialize(address(this), 200, 200, 200, 200, 200, 100, address(this));
  }

  function setUpBase() public {
    RenBtcEthConverterMainnet converter = new RenBtcEthConverterMainnet();
    (vault, ) = initializeProxy(address(converter));

    vault.addModule(address(moduleWBTC), ModuleType.LoanOverride, 181e3, 82e3);
    vault.addModule(address(moduleUSDC), ModuleType.LoanOverride, 330e3, 82e3);
    vault.addModule(address(moduleETH), ModuleType.LoanOverride, 257e3, 82e3);
    vault.addModule(address(0x0), ModuleType.Null, 84e3, 83e3);
    bytes memory bytecode = (vm.getCode("MockGatewayLogicV1.sol"));
    address mockGateway;
    assembly {
      mockGateway := create(0, add(bytecode, 0x20), mload(bytecode))
    }
    vm.etch(gateway, mockGateway.code);
    assertEq0(gateway.code, mockGateway.code);
    gateway.call(abi.encodeWithSignature("setToken(address)", renbtc));
    bytes memory sig;
    IGateway(gateway).mint(bytes32(0x0), 11e8, bytes32(0x0), sig);
    IERC20(renbtc).approve(address(vault), ~uint256(1) << 2);
    vm.deal(address(vault), 10 ether);
    vault.deposit(10e8, address(this));
  }

  function getBalance(address module) public returns (uint256) {
    if (module == address(moduleWBTC)) {
      console.log("wbtc");
      return IERC20(wbtc).balanceOf(zerowallet);
    } else if (module == address(moduleUSDC)) {
      console.log("usdc");
      return IERC20(usdc).balanceOf(zerowallet);
    } else if (module == address(moduleETH)) {
      console.log("eth");
      return zerowallet.balance;
    } else {
      console.log("renbtc");
      return IERC20(renbtc).balanceOf(zerowallet);
    }
  }

  modifier checkBalance(address module) {
    uint256 balance = getBalance(module);
    _;
    require(getBalance(module) > balance, "tokens not generated");
    console.log("tokens generated", getBalance(module) - balance);
  }

  function zeroLoan(address module, uint256 amount) public checkBalance(module) {
    bytes memory data;
    vault.loan(address(module), zerowallet, amount, 1, data);
    bytes memory sig;
    vault.repay(address(module), zerowallet, amount, 1, data, address(this), bytes32(0), sig);
  }
}
