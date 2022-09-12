// SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;

import "./Common.test.sol";

contract RevertTest is Common {
  function testFailIfSameLoanId() public {
    bytes memory data;
    vault.loan(address(moduleWBTC), zerowallet, 1e8, 1, data);
    // should revert due to the same loanid being generated
    vm.expectRevert();
    vault.loan(address(moduleWBTC), zerowallet, 1e8, 1, data);
  }

  function testFailOnRepayingNonexistentLoan() public {
    bytes memory data;
    bytes memory sig;

    vault.loan(address(0x0), zerowallet, 1e6, 1, data);
    vm.warp(block.timestamp + DefaultMaxLoanDuration + 1);

    vault.closeExpiredLoan(address(0x0), zerowallet, 1e6, 1, data, address(this));

    // try repaying already expired loan
    vault.repay(address(0x0), zerowallet, 1e6, 1, data, address(this), bytes32(0x0), sig);
  }

  function testFailOnReinitialize() public {
    vault.initialize(
      // initialGovernance
      address(this),
      DefaultZeroBorrowFeeBips,
      DefaultRenBorrowFeeBips,
      DefaultZeroBorrowFeeStatic,
      DefaultRenBorrowFeeStatic,
      DefaultZeroFeeShareBips
    );
  }

  function testFailOnInvalidInitializeValues() public {
    ZeroBTC _vault = deployProxy(2);
    vm.expectRevert();
    vault.initialize(
      address(this),
      //bips (cant be > 2000 or 0)
      0,
      DefaultRenBorrowFeeBips,
      DefaultZeroBorrowFeeStatic,
      DefaultRenBorrowFeeStatic,
      DefaultZeroFeeShareBips
    );
    vm.expectRevert();
    vault.initialize(
      address(this),
      //bips (cant be > 2000 or 0)
      DefaultZeroBorrowFeeBips,
      0,
      DefaultZeroBorrowFeeStatic,
      DefaultRenBorrowFeeStatic,
      DefaultZeroFeeShareBips
    );
    vm.expectRevert();
    vault.initialize(
      address(this),
      //bips (cant be > 2000 or 0)
      DefaultZeroBorrowFeeBips,
      DefaultRenBorrowFeeBips,
      DefaultZeroBorrowFeeStatic,
      DefaultRenBorrowFeeStatic,
      0
    );

    vm.expectRevert();
    vault.initialize(
      address(this),
      //bips (cant be > 2000 or 0)
      DefaultZeroBorrowFeeBips,
      2000,
      DefaultZeroBorrowFeeStatic,
      DefaultRenBorrowFeeStatic,
      DefaultZeroFeeShareBips
    );
    vm.expectRevert();
    vault.initialize(
      address(this),
      //bips (cant be > 2000 or 0)
      2000,
      DefaultRenBorrowFeeBips,
      DefaultZeroBorrowFeeStatic,
      DefaultRenBorrowFeeStatic,
      DefaultZeroFeeShareBips
    );
    vm.expectRevert();
    vault.initialize(
      address(this),
      //bips (cant be > 2000 or 0)
      DefaultZeroBorrowFeeBips,
      DefaultRenBorrowFeeBips,
      DefaultZeroBorrowFeeStatic,
      DefaultRenBorrowFeeStatic,
      2000
    );
  }

  function testFailOnInvalidModule() public {
    address invalidModule = address(new ConvertWBTCMainnet(address(0)));
    vault.addModule(invalidModule, ModuleType.LoanOverride, 100e3, 100e3);
  }

  function testFailOnClosingNotExpiredLoan() public {
    bytes memory data;
    vault.loan(address(0x0), zerowallet, 1000000, 1, data);
    vm.expectRevert();
    vault.closeExpiredLoan(address(0x0), zerowallet, 1000000, 1, data, address(this));
  }

  function testFailOnRepayingNonExistentLoan() public {
    bytes memory sig;
    bytes memory data;
    vault.repay(address(0x0), zerowallet, 1e6, 1, data, address(this), bytes32(0x0), sig);
  }

  // function testFailOnRepayingExpiredLoan() public {
  //   bytes memory data;
  //   vault.loan(address(0x0), zerowallet, 1000000, 1, data);
  //   vm.warp(block.timestamp + DefaultMaxLoanDuration + 1);
  //   bytes memory sig;
  //   vault.repay(address(0x0), zerowallet, 1e6, 1, data, address(this), bytes32(0x0), sig);
  // }
}
