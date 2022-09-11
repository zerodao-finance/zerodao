pragma solidity >=0.8.13;

import "../erc4626/interfaces/IZeroBTC.sol";
import "./Common.sol";

contract BTCVaultTestMainnet is Common {
  constructor() {}

  function setUp() public virtual override {
    initiateMainnetFork();
    super.setUp();
  }

  /*//////////////////////////////////////////////////////////////
                          Deployment Tests
  //////////////////////////////////////////////////////////////*/

  function testConstructor() external {
    (
      address _gatewayRegistry,
      address _btcEthPriceOracle,
      address _gasPriceOracle,
      address _renBtcConverter,
      uint256 _cacheTimeToLive,
      uint256 _maxLoanDuration,
      uint256 _targetEthReserve,
      uint256 _maxGasProfitShareBips,
      address _zeroFeeRecipient
    ) = vault.getConfig();
    assertEq(_gatewayRegistry, gatewayRegistry);
    assertEq(_btcEthPriceOracle, btcEthOracle);
    assertEq(_gasPriceOracle, gasPriceOracle);
    assertEq(_renBtcConverter, renBtcConverter);
    assertEq(_cacheTimeToLive, DefaultCacheTTL);
    assertEq(_maxLoanDuration, DefaultMaxLoanDuration);
    assertEq(_targetEthReserve, DefaultTargetEthReserve);
    assertEq(_maxGasProfitShareBips, DefaultMaxGasProfitShareBips);
    assertEq(_zeroFeeRecipient, address(this));
    assertEq(vault.name(), "ZeroBTC");
    assertEq(vault.symbol(), "ZBTC");
    assertEq(vault.decimals(), 8);
  }

  function testInitialize() external {
    (
      uint256 zeroBorrowFeeBips,
      uint256 renBorrowFeeBips,
      uint256 zeroFeeShareBips,
      uint256 zeroBorrowFeeStatic,
      uint256 renBorrowFeeStatic,
      /* uint256 satoshiPerEth */,
      /* uint256 gweiPerGas */,
      /* uint256 lastUpdateTimestamp */,
      /* uint256 totalBitcoinBorrowed */,
      /* uint256 unburnedGasReserveShares */,
      /* uint256 unburnedZeroFeeShares */
    ) = vault.getGlobalState();
    assertEq(zeroBorrowFeeBips, DefaultZeroBorrowFeeBips);
    assertEq(renBorrowFeeBips, DefaultRenBorrowFeeBips);
    assertEq(zeroFeeShareBips, DefaultZeroBorrowFeeStatic);
    assertEq(zeroBorrowFeeStatic, DefaultRenBorrowFeeStatic);
    assertEq(renBorrowFeeStatic, DefaultZeroFeeShareBips);
  }

  function testMockGatewayLogic() public {
    mintRenBtc(1);
    assertEq(IERC20(renbtc).balanceOf(address(this)), 1, "RenBTC not being minted");
  }

  function testModuleTypes() public {
    vault.addModule(moduleDummy, ModuleType.LoanAndRepayOverride, 1000, 1000);
    vault.removeModule(moduleDummy);
  }

  function testZeroLoanRenBTC() public {
    zeroLoan(address(0x0), 1e8);
  }

  function testZeroLoanWBTC() public {
    zeroLoan(address(moduleWBTC), 1e8);
  }

  function testZeroLoanUSDC() public {
    zeroLoan(address(moduleUSDC), 1e8);
  }

  function testZeroLoanETH() public {
    zeroLoan(address(moduleETH), 1e8);
  }

  function testExpiry() public {
    bytes memory data;
    vault.loan(address(0x0), zerowallet, 1000000, 1, data);
    vm.warp(block.timestamp + 3601);
    vault.closeExpiredLoan(address(0x0), zerowallet, 1000000, 1, data, address(this));
  }
}
