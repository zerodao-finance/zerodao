// SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;

import "./Common.test.sol";
import "../erc4626/interfaces/EIP712Errors.sol";
import "./DummyModule.sol";

contract RevertTest is Common {
  //TODO: fix this failing due to reentrancy
  // function testRevertOnZeroShares() public {
  //   ZeroBTC _vault = deployProxy(1);
  //   vm.expectRevert();
  //   _vault.deposit(0, address(this));
  // }

  function testFalseModuleInitialize() public {
    address invalidModule = address(new DummyModuleInitializeFail(renbtc));
    vm.expectRevert(bytes("module uninitialized"));
    vault.addModule(invalidModule, ModuleType.LoanOverride, 100e3, 100e3);
  }

  function testRevertOnTransferFromFail() public {
    vm.expectRevert(bytes("TRANSFER_FROM_FAILED"));
    vault.deposit(1e18, address(this));
  }

  function testRevertIfSameLoanId() public {
    bytes memory data;
    vault.loan(address(moduleWBTC), zerowallet, 1e8, 1, data);
    (, bytes32 loanId) = _deriveLoanPHashAndId(address(moduleWBTC), zerowallet, 1e8, 1, data);
    // should revert due to the same loanid being generated
    vm.expectRevert(abi.encodeWithSelector(IZeroBTC.LoanIdNotUnique.selector, loanId));
    vault.loan(address(moduleWBTC), zerowallet, 1e8, 1, data);
  }

  function testRevertOnWrongModuleAddress() public {
    bytes memory data;
    vm.expectRevert(IZeroBTC.ModuleDoesNotExist.selector);
    vault.loan(address(this), zerowallet, 1e8, 1, data);
  }

  function testRevertOnRepayingNonexistentLoan() public {
    bytes memory data;
    bytes memory sig;

    vault.loan(address(0x0), zerowallet, 1e6, 1, data);
    vm.warp(block.timestamp + DefaultMaxLoanDuration + 1);

    vault.closeExpiredLoan(address(0x0), zerowallet, 1e6, 1, data, address(this));
    (, bytes32 loanId) = _deriveLoanPHashAndId(address(0x0), zerowallet, 1e6, 1, data);
    vm.expectRevert(abi.encodeWithSelector(IZeroBTC.LoanDoesNotExist.selector, loanId));
    // try repaying already expired loan
    vault.repay(address(0x0), zerowallet, 1e6, 1, data, address(this), bytes32(0x0), sig);
  }

  function testRevertOnReinitialize() public {
    vm.expectRevert(InitializationErrors.AlreadyInitialized.selector);
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

  function testRevertOnInvalidInitializeValues() public {
    ZeroBTC _vault = deployProxy(1);
    vm.expectRevert(IZeroBTC.InvalidDynamicBorrowFee.selector);
    _vault.initialize(
      address(this),
      //bips (cant be > 2000 or 0)
      0,
      DefaultRenBorrowFeeBips,
      DefaultZeroBorrowFeeStatic,
      DefaultRenBorrowFeeStatic,
      DefaultZeroFeeShareBips,
      address(this)
    );
    vm.expectRevert(IZeroBTC.InvalidDynamicBorrowFee.selector);
    _vault.initialize(
      address(this),
      //bips (cant be > 2000 or 0)
      DefaultZeroBorrowFeeBips,
      0,
      DefaultZeroBorrowFeeStatic,
      DefaultRenBorrowFeeStatic,
      DefaultZeroFeeShareBips,
      address(this)
    );
    vm.expectRevert(IZeroBTC.InvalidDynamicBorrowFee.selector);
    _vault.initialize(
      address(this),
      //bips (cant be > 2000 or 0)
      DefaultZeroBorrowFeeBips,
      DefaultRenBorrowFeeBips,
      DefaultZeroBorrowFeeStatic,
      DefaultRenBorrowFeeStatic,
      0,
      address(this)
    );

    vm.expectRevert(IZeroBTC.InvalidDynamicBorrowFee.selector);
    _vault.initialize(
      address(this),
      //bips (cant be > 2000 or 0)
      DefaultZeroBorrowFeeBips,
      2001,
      DefaultZeroBorrowFeeStatic,
      DefaultRenBorrowFeeStatic,
      DefaultZeroFeeShareBips,
      address(this)
    );
    vm.expectRevert(IZeroBTC.InvalidDynamicBorrowFee.selector);
    _vault.initialize(
      address(this),
      //bips (cant be > 2000 or 0)
      2001,
      DefaultRenBorrowFeeBips,
      DefaultZeroBorrowFeeStatic,
      DefaultRenBorrowFeeStatic,
      DefaultZeroFeeShareBips,
      address(this)
    );
    vm.expectRevert(IZeroBTC.InvalidDynamicBorrowFee.selector);
    _vault.initialize(
      address(this),
      //bips (cant be > 2000 or 0)
      DefaultZeroBorrowFeeBips,
      DefaultRenBorrowFeeBips,
      DefaultZeroBorrowFeeStatic,
      DefaultRenBorrowFeeStatic,
      2001,
      address(this)
    );
  }

  function testRevertOnModuleWithWrongAsset() public {
    //initialize with wrong asset
    address invalidModule = address(new ConvertWBTCMainnet(address(0)));
    vm.expectRevert(abi.encodeWithSelector(IZeroBTC.ModuleAssetDoesNotMatch.selector, address(0x0)));
    vault.addModule(invalidModule, ModuleType.LoanOverride, 100e3, 100e3);
  }

  function testRevertOnClosingNotExpiredLoan() public {
    bytes memory data;
    vault.loan(address(0x0), zerowallet, 1e6, 1, data);
    (, bytes32 loanId) = _deriveLoanPHashAndId(address(0x0), zerowallet, 1e6, 1, data);
    vm.expectRevert(abi.encodeWithSelector(IZeroBTC.LoanNotExpired.selector, loanId));
    vault.closeExpiredLoan(address(0x0), zerowallet, 1000000, 1, data, address(this));
  }

  function testRevertOnUnauthorizedDeposit() public {
    vm.startPrank(address(100));
    mintRenBtc(1e6);
    // Approve vault to spend asset
    IERC20(renbtc).approve(address(vault), 1e6);
    vm.expectRevert(bytes("unauthorized"));
    vault.deposit(1e6, address(100));
    vm.stopPrank();
    address[] memory _a = new address[](1);
    _a[0] = address(100);
    vault.setAuthorizedUsers(_a);
    vm.startPrank(address(100));
    vault.deposit(1e6, address(100));
  }

  function testRevertOnAddingNullModule() public {
    vm.expectRevert();
    vault.addModule(address(this), ModuleType.Null, 100, 100);
  }

  function testRevertOnRepayingNonExistentLoan() public {
    bytes memory sig;
    bytes memory data;
    (, bytes32 loanId) = _deriveLoanPHashAndId(address(0x0), zerowallet, 1e6, 1, data);
    vm.expectRevert(abi.encodeWithSelector(IZeroBTC.LoanDoesNotExist.selector, loanId));
    vault.repay(address(0x0), zerowallet, 1e6, 1, data, address(this), bytes32(0x0), sig);
  }

  function testRevertOnWithdrawingLockedShares() public {
    bytes memory data;
    // using a different user
    approveDeposit(address(100));
    vm.startPrank(address(100));
    mintRenBtc(2e6);
    IERC20(renbtc).approve(address(vault), MaxUintApprove);
    vault.deposit(1e6, address(100));
    vault.loan(address(0x0), zerowallet, 1e6, 1, data);
    vm.expectRevert(stdError.arithmeticError);
    vault.withdraw(1e6, address(100), address(100));
  }

  function testRevertOnLoanMoreThanLendersBalance() public {
    bytes memory data;
    // using a different user
    approveDeposit(address(100));
    vm.startPrank(address(100));
    mintRenBtc(2e6);
    IERC20(renbtc).approve(address(vault), MaxUintApprove);
    vault.deposit(1e6, address(100));
    vm.expectRevert(stdError.arithmeticError);
    vault.loan(address(0x0), zerowallet, 2e6, 1, data);
  }

  function testRevertOnFallbackMintingExistingLoan() public {
    bytes memory data;
    vault.loan(address(0x0), zerowallet, 1000000, 1, data);
    vm.expectRevert(bytes("loan exists"));
    vault.fallbackMint(address(0x0), zerowallet, 1e6, 1, data, bytes32(0x0), data);
  }

  function testRevertOnRepayingAnotherKeeper() public {
    bytes memory data;
    vault.loan(address(0x0), zerowallet, 1000000, 1, data);
    vm.expectRevert("mismatching lender for loan");
    vault.repay(address(0x0), zerowallet, 1e6, 1, data, address(0x0), bytes32(0x0), data);
  }

  function testRevertOnDuplicateLoans() public {
    bytes memory data;
    vault.loan(address(0x0), zerowallet, 1000000, 1, data);
    approveDeposit(address(100));
    vm.startPrank(address(100));
    mintRenBtc(2e6);
    IERC20(renbtc).approve(address(vault), MaxUintApprove);
    vault.deposit(1e6, address(100));
    (, bytes32 loanId) = _deriveLoanPHashAndId(address(0x0), zerowallet, 1e6, 1, data);
    vm.expectRevert(abi.encodeWithSelector(IZeroBTC.LoanIdNotUnique.selector, loanId));
    vault.loan(address(0x0), zerowallet, 1000000, 1, data);
  }
  //TODO: check if this is intended behavior
  // function testFailOnRepayingExpiredLoan() public {
  //   bytes memory data;
  //   vault.loan(address(0x0), zerowallet, 1000000, 1, data);
  //   vm.warp(block.timestamp + DefaultMaxLoanDuration + 1);
  //   bytes memory sig;
  //   vault.repay(address(0x0), zerowallet, 1e6, 1, data, address(this), bytes32(0x0), sig);
  // }
}
