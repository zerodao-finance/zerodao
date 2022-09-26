// SPDX-License-Identifier: MIT
pragma solidity >=0.8.13;

import "forge-std/Test.sol";
import "../erc4626/vault/ZeroBTC.sol";
import { IGateway, IGatewayRegistry } from "../interfaces/IGatewayRegistry.sol";
import { IChainlinkOracle } from "../interfaces/IChainlinkOracle.sol";
import { ConvertWBTCMainnet } from "../modules/mainnet/ConvertWBTC.sol";
import { ConvertUSDCMainnet } from "../modules/mainnet/ConvertUSDC.sol";
import { ConvertNativeMainnet } from "../modules/mainnet/ConvertNative.sol";
import { RenBtcEthConverterMainnet } from "../util/RenBtcEthConverter.sol";
import { TransparentUpgradeableProxy } from "@openzeppelin/contracts-new/proxy/transparent/TransparentUpgradeableProxy.sol";
import { ProxyAdmin } from "@openzeppelin/contracts-new/proxy/transparent/ProxyAdmin.sol";
import "../erc4626/interfaces/IRenBtcEthConverter.sol";
import { BlockGasPriceOracle } from "../erc4626/utils/BlockGasPriceOracle.sol";
import "./MockBtcEthPriceOracle.sol";
import "./MockGasPriceOracle.sol";

contract VaultTestHelpers is Test {
  using Math for uint256;
  using FixedPointMathLib for uint256;

  //initializer values
  uint256 constant DefaultCacheTTL = 3600;
  uint256 constant DefaultMaxLoanDuration = 3600;
  uint256 constant DefaultTargetEthReserve = 1 ether;
  uint256 constant DefaultMaxGasProfitShareBips = 200.000;
  uint256 constant DefaultZeroBorrowFeeBips = 200;
  uint256 constant DefaultRenBorrowFeeBips = 200;
  uint256 constant DefaultZeroBorrowFeeStatic = 200;
  uint256 constant DefaultRenBorrowFeeStatic = 200;
  uint256 constant DefaultZeroFeeShareBips = 200;

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

  // Zero contracts
  address zerowallet = 0x0F4ee9631f4be0a63756515141281A3E2B293Bbe;
  address renBtcConverter;
  address moduleWBTC;
  address moduleUSDC;
  address moduleETH;
  ZeroBTC vault;
  ProxyAdmin proxyAdmin;
  address implementation;

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

  receive() external payable {}

  /*//////////////////////////////////////////////////////////////
                    Chain-Specific Initialization
  //////////////////////////////////////////////////////////////*/

  // function initiateArbitrumFork() public {
  //   renbtc = 0xDBf31dF14B66535aF65AaC99C32e9eA844e14501;
  //   wbtc = 0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f;
  //   usdc = 0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8;
  //   gateway = 0x05Cadbf3128BcB7f2b89F3dD55E5B0a036a49e20;
  //   rencrv = 0x3E01dD8a5E1fb3481F0F589056b428Fc308AF0Fb;
  //   btcEthOracle = 0xc5a90A6d7e4Af242dA238FFe279e9f2BA0c64B2e;
  //   gasPriceOracle = address(new BlockGasPriceOracle());
  //   moduleWBTC = address(new ConvertWBTCArbitrum(renbtc));
  //   moduleUSDC = address(new ConvertUSDCArbitrum(renbtc));
  //   moduleETH = address(new ConvertNativeArbitrum(renbtc));
  //   // @todo arbitrum version
  //   renBtcConverter = address(new RenBtcEthConverterMainnet());
  // }

  /*//////////////////////////////////////////////////////////////
                         Deployment & Setup
  //////////////////////////////////////////////////////////////*/

  /**
   * @dev Should set:
   * - renbtc
   * - wbtc
   * - usdc
   * - gateway
   * - rencrv
   * - btcEthOracle
   * - gasPriceOracle
   * - moduleWBTC
   * - moduleUSDC
   * - moduleETH
   * - renBtcConverter
   */
  function setUpNetwork() internal virtual {
    // Mainnet default
    moduleWBTC = address(new ConvertWBTCMainnet(renbtc));
    moduleUSDC = address(new ConvertUSDCMainnet(renbtc));
    moduleETH = address(new ConvertNativeMainnet(renbtc));
    renBtcConverter = address(new RenBtcEthConverterMainnet());
  }

  function setUp() public virtual {
    setUpNetwork();
    proxyAdmin = new ProxyAdmin();
    initializeProxy();
    vault.addModule(address(moduleWBTC), ModuleType.LoanOverride, 181e3, 82e3);
    vault.addModule(address(moduleUSDC), ModuleType.LoanOverride, 330e3, 82e3);
    vault.addModule(address(moduleETH), ModuleType.LoanOverride, 257e3, 82e3);
    vault.addModule(address(0x0), ModuleType.Null, 84e3, 83e3);
    vault.authorize(address(this));
    deployGateway();

    // Give vault ETH for gas refunds
    vm.deal(address(vault), 10 ether);

    // Deposit 10 BTC
    deposit(1e9);
    vm.label(renbtc, "renbtc");
    vm.label(wbtc, "wbtc");
    vm.label(usdc, "usdc");
    vm.label(gateway, "gateway");
    vm.label(zerowallet, "zerowallet");
    vm.label(rencrv, "rencrv");
    vm.label(gatewayRegistry, "gatewayRegistry");
    vm.label(btcEthOracle, "btcEthOracle");
    vm.label(gasPriceOracle, "gasPriceOracle");
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
    TransparentUpgradeableProxy _proxy = new TransparentUpgradeableProxy(implementation, address(proxyAdmin), "");
    _vault = ZeroBTC(payable(address(_proxy)));
  }

  function initializeProxy() internal {
    vault = deployProxy(1);
    vault.initialize(
      // initialGovernance
      address(this),
      DefaultZeroBorrowFeeBips,
      DefaultRenBorrowFeeBips,
      DefaultZeroBorrowFeeStatic,
      DefaultRenBorrowFeeStatic,
      DefaultZeroFeeShareBips,
      address(this)
    );
  }

  function deployGateway() internal {
    vm.etch(gateway, deployCode("MockGatewayLogicV1.sol").code);
    gateway.call(abi.encodeWithSignature("setToken(address)", renbtc));
  }

  /*//////////////////////////////////////////////////////////////
                            Token Helpers
  //////////////////////////////////////////////////////////////*/

  function mintRenBtc(uint256 btcAmount) internal {
    // Mint asset
    IGateway(gateway).mint(bytes32(0x0), btcAmount, bytes32(0x0), "");
  }

  function deposit(uint256 btcAmount) internal {
    mintRenBtc(btcAmount);
    // Approve vault to spend asset
    IERC20(renbtc).approve(address(vault), btcAmount);
    // Deposit
    vault.deposit(btcAmount, address(this));
  }

  function getBalance(address module) public view returns (uint256) {
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
  }

  /*//////////////////////////////////////////////////////////////
                  Expected & Real Value Derivation
  //////////////////////////////////////////////////////////////*/

  function getExpectedGasFeeAndBtcPrice() internal view returns (uint256 satoshiPerEth, uint256 gweiPerGas) {
    if (checkGlobalCacheExpired()) {
      satoshiPerEth = 1e26 / IChainlinkOracle(btcEthOracle).latestAnswer();
      gweiPerGas = ((IChainlinkOracle(gasPriceOracle).latestAnswer() - 1) / 1e9) + 1;
    } else {
      (, , , , , satoshiPerEth, gweiPerGas, , , , ) = vault.getGlobalState();
    }
  }

  function getExpectedModuleFees(address module)
    internal
    view
    returns (
      uint256 ethRefundForLoanGas,
      uint256 ethRefundForRepayGas,
      uint256 btcFeeForLoanGas,
      uint256 btcFeeForRepayGas
    )
  {
    if (checkGlobalCacheExpired()) {
      (, uint256 loanGasE4, uint256 repayGasE4, , , , , ) = vault.getModuleState(moduleETH);
      (uint256 satoshiPerEth, uint256 gweiPerGas) = getExpectedGasFeeAndBtcPrice();
      uint256 weiPerGas = gweiPerGas * 1 gwei;
      ethRefundForLoanGas = (loanGasE4 * 10000) * weiPerGas;
      ethRefundForRepayGas = (repayGasE4 * 10000) * weiPerGas;
      btcFeeForLoanGas = (ethRefundForLoanGas * satoshiPerEth) / 1e18;
      btcFeeForRepayGas = (ethRefundForRepayGas * satoshiPerEth) / 1e18;
    } else {
      return getModuleFees(module);
    }
  }

  function getModuleFees(address module)
    internal
    view
    returns (
      uint256 ethRefundForLoanGas,
      uint256 ethRefundForRepayGas,
      uint256 btcFeeForLoanGas,
      uint256 btcFeeForRepayGas
    )
  {
    (, , , ethRefundForLoanGas, ethRefundForRepayGas, btcFeeForLoanGas, btcFeeForRepayGas, ) = vault.getModuleState(
      module
    );
  }

  /**
   * @dev Get loan fees that contract should use on next call - using current cache
   * or the cache it will have upon a required update.
   */
  function getExpectedLoanFees(address module, uint256 borrowAmount)
    internal
    view
    returns (
      uint256 actualBorrowAmount,
      uint256 lenderDebt,
      uint256 btcFeeForLoanGas,
      uint256 ethRefundForLoanGas
    )
  {
    uint256 renFees = DefaultRenBorrowFeeStatic + borrowAmount.uncheckedMulBipsUp(DefaultRenBorrowFeeBips);
    uint256 zeroFees = DefaultZeroBorrowFeeStatic + borrowAmount.uncheckedMulBipsUp(DefaultZeroBorrowFeeBips);

    uint256 btcFeeForRepayGas;
    (ethRefundForLoanGas, , btcFeeForLoanGas, btcFeeForRepayGas) = getExpectedModuleFees(module);

    lenderDebt = borrowAmount - renFees;

    actualBorrowAmount = lenderDebt - (zeroFees + btcFeeForLoanGas + btcFeeForRepayGas);
  }

  /*//////////////////////////////////////////////////////////////
                         Validation Helpers
  //////////////////////////////////////////////////////////////*/

  function validateModule(
    address module,
    ModuleType _moduleType,
    uint256 gweiPerGas,
    uint256 satoshiPerEth,
    uint256 loanGas,
    uint256 repayGas,
    uint256 lastUpdate
  ) internal {
    {
      (ModuleType moduleType, , , , , , , ) = vault.getModuleState(module);
      assertEq(uint256(moduleType), uint256(_moduleType));
    }
    {
      (
        ,
        uint256 loanGasE4,
        uint256 repayGasE4,
        uint256 ethRefundForLoanGas,
        uint256 ethRefundForRepayGas,
        uint256 btcFeeForLoanGas,
        uint256 btcFeeForRepayGas,

      ) = vault.getModuleState(module);
      assertEq(loanGasE4, ((loanGas - 1) / 10000) + 1);
      assertEq(repayGasE4, ((repayGas - 1) / 10000) + 1);

      uint256 weiPerGas = gweiPerGas * 1 gwei;
      assertEq(ethRefundForLoanGas, (loanGasE4 * 10000) * weiPerGas);
      assertEq(ethRefundForRepayGas, (repayGasE4 * 10000) * weiPerGas);
      assertEq(btcFeeForLoanGas, (ethRefundForLoanGas * satoshiPerEth) / 1e18);
      assertEq(btcFeeForRepayGas, (ethRefundForRepayGas * satoshiPerEth) / 1e18);
    }
    {
      (, , , , , , , uint256 lastUpdateTimestamp) = vault.getModuleState(module);
      assertEq(lastUpdateTimestamp, lastUpdate);
    }
  }

  function validateGlobalCacheUpdatedThisBlock() internal {
    uint256 newSatoshiPerEth = 1e26 / IChainlinkOracle(btcEthOracle).latestAnswer();
    uint256 newGweiPerGas = ((IChainlinkOracle(gasPriceOracle).latestAnswer() - 1) / 1e9) + 1;
    (, , , , , uint256 satoshiPerEth, uint256 gweiPerGas, uint256 _lastUpdateTimestamp, , , ) = vault.getGlobalState();
    assertEq(_lastUpdateTimestamp, block.timestamp, "Cache not updated this block");
    assertEq(satoshiPerEth, newSatoshiPerEth, "Cache updated this block with bad satoshiPerEth");
    assertEq(gweiPerGas, newGweiPerGas, "Cache updated this block with bad gweiPerGas");
  }

  function checkGlobalCacheExpired() internal view returns (bool shouldUpdate) {
    (, , , , , , , uint256 lastUpdateTimestamp, , , ) = vault.getGlobalState();
    shouldUpdate = (block.timestamp - lastUpdateTimestamp) > DefaultCacheTTL;
  }

  event GlobalStateCacheUpdated(uint256 satoshiPerEth, uint256 getGweiPerGas);

  function validateUpdatesGlobalCache(bytes4 testSelector, bool shouldUpdate) internal {
    (, , , , , , , uint256 lastUpdateTimestamp, , , ) = vault.getGlobalState();
    if (shouldUpdate) {
      (uint256 newSatoshiPerEth, uint256 newGweiPerGas) = getExpectedGasFeeAndBtcPrice();
      vm.expectEmit(false, false, false, true, address(vault));
      emit GlobalStateCacheUpdated(newSatoshiPerEth, newGweiPerGas);
    }
    address(this).call(abi.encode(testSelector));
    if (shouldUpdate) {
      validateGlobalCacheUpdatedThisBlock();
    } else {
      (, , , , , , , uint256 newLastUpdateTimestamp, , , ) = vault.getGlobalState();
      assertEq(lastUpdateTimestamp, newLastUpdateTimestamp, "State updated when it should not have");
    }
  }

  function _deriveLoanPHashAndId(
    address module,
    address borrower,
    uint256 borrowAmount,
    uint256 nonce,
    bytes memory data
  ) internal view returns (bytes32 pHash, bytes32 loanId) {
    pHash = keccak256(abi.encode(address(vault), module, borrower, borrowAmount, nonce, keccak256(data)));
    loanId = keccak256(abi.encode(address(this), pHash));
  }
}
