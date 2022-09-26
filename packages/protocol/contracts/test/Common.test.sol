// SPDX-License-Identifier: MIT
pragma solidity >=0.8.13;

import "./VaultTestHelpers.sol";

contract Common is VaultTestHelpers {
  /*//////////////////////////////////////////////////////////////
                          Deployment Tests
  //////////////////////////////////////////////////////////////*/

  using FixedPointMathLib for uint256;

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
      uint256 renBorrowFeeStatic, /* uint256 satoshiPerEth */ /* uint256 gweiPerGas */ /* uint256 lastUpdateTimestamp */ /* uint256 totalBitcoinBorrowed */ /* uint256 unburnedGasReserveShares */ /* uint256 unburnedZeroFeeShares */
      ,
      ,
      ,
      ,
      ,

    ) = vault.getGlobalState();
    assertEq(zeroBorrowFeeBips, DefaultZeroBorrowFeeBips);
    assertEq(renBorrowFeeBips, DefaultRenBorrowFeeBips);
    assertEq(zeroFeeShareBips, DefaultZeroBorrowFeeStatic);
    assertEq(zeroBorrowFeeStatic, DefaultRenBorrowFeeStatic);
    assertEq(renBorrowFeeStatic, DefaultZeroFeeShareBips);
  }

  /*//////////////////////////////////////////////////////////////
                            Config Tests
  //////////////////////////////////////////////////////////////*/

  function testAddModule() external {
    btcEthOracle = address(new MockBtcEthPriceOracle());
    gasPriceOracle = address(new MockGasPriceOracle());
    // 1 eth per btc
    MockBtcEthPriceOracle(btcEthOracle).setLatestAnswer(1e18);
    // 1000 wei per gas - should be rounded up to 1 gwei
    MockGasPriceOracle(gasPriceOracle).setLatestAnswer(1000);
    initializeProxy();
    // 1000 gas for loan / repay - should be rounded up to 10000
    vault.addModule(address(moduleETH), ModuleType.LoanOverride, 1000, 1000);
    // Validate module's cached and configured state
    validateModule(moduleETH, ModuleType.LoanOverride, 1, 1e8, 1000, 1000, block.timestamp);
    // Check against expected final values
    (, uint256 loanGasE4, , uint256 ethRefundForLoanGas, , uint256 btcFeeForLoanGas, , ) = vault.getModuleState(
      moduleETH
    );
    // Rounded up to 1e4
    assertEq(loanGasE4, 1, "Incorrect initial loanGasE4");
    // 1e4 * 1e9
    assertEq(ethRefundForLoanGas, 1e13, "Incorrect initial ethRefundForLoanGas");
    // 1 eth = 1 btc, 1e13 wei = 1e3 satoshi
    assertEq(btcFeeForLoanGas, 1e3, "Incorrect initial btcFeeForLoanGas");
  }

  /*//////////////////////////////////////////////////////////////
                             Loan Tests
  //////////////////////////////////////////////////////////////*/

  function testLoan() external {
    uint256 borrowAmount = 1e8;
    (
      uint256 expectedActualBorrowAmount,
      uint256 expectedLenderDebt,
      uint256 expectedBtcFeeForLoanGas,
      uint256 expectedEthRefundForLoanGas
    ) = getExpectedLoanFees(moduleETH, borrowAmount);
    vm.deal(address(100), 0);
    vm.prank(address(this), address(100));

    vault.loan(address(moduleETH), zerowallet, borrowAmount, 1, "");

    (, bytes32 loanId) = _deriveLoanPHashAndId(moduleETH, zerowallet, borrowAmount, 1, "");
    (
      uint256 sharesLocked,
      uint256 actualBorrowAmount,
      uint256 lenderDebt,
      uint256 btcFeeForLoanGas,
      uint256 expiry
    ) = vault.getOutstandingLoan(uint256(loanId));
    assertEq(actualBorrowAmount, expectedActualBorrowAmount, "loan's actualBorrowAmount did not match expected");
    assertEq(lenderDebt, expectedLenderDebt, "loan's lenderDebt did not match expected");
    assertEq(btcFeeForLoanGas, expectedBtcFeeForLoanGas, "loan's btcFeeForLoanGas did not match expected");
    assertEq(expiry, block.timestamp + DefaultMaxLoanDuration, "loan's expiry did not match expected");
    assertEq(address(100).balance, expectedEthRefundForLoanGas, "tx.origin did not receive expected refund");
  }

  function zeroLoan(address module, uint256 amount) public checkBalance(module) {
    bytes memory data;
    vault.loan(address(module), zerowallet, amount, 1, data);
    bytes memory sig;
    vault.repay(address(module), zerowallet, amount, 1, data, address(this), bytes32(0), sig);
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
    vm.warp(block.timestamp + DefaultMaxLoanDuration + 1);
    vault.closeExpiredLoan(address(0x0), zerowallet, 1000000, 1, data, address(this));
  }

  function testEarn() public {
    zeroLoan(address(moduleWBTC), 1e6);
    (, , , , , uint256 satoshiPerEth, , , , uint256 unburnedGasReserveShares, uint256 unburnedZeroFeeShares) = vault
      .getGlobalState();
    uint256 totalFeeShares = unburnedZeroFeeShares + unburnedGasReserveShares;
    uint256 totalFees;
    uint256 currentSupply = vault.totalSupply();
    unchecked {
      totalFees = totalFeeShares.mulDivDown(vault.totalAssets(), currentSupply);
    }
    uint256 balance = address(vault).balance;
    vm.prank(address(100));
    vm.expectRevert(bytes("cannot call unless harvester"));
    vault.earn();
    vault.earn();
    assertEq(vault.totalSupply(), currentSupply - totalFeeShares);
    //TODO: fix this
    uint256 minAmount = (((totalFees * 1 ether) / satoshiPerEth) * 90) / 100;
    require(address(vault).balance - balance >= minAmount, "assets not converted");
  }
}
