pragma solidity >=0.8.13;
import "./Common.sol";

contract BTCVaultTestArbitrum is Common {
  constructor() {}

  function setUp() public {
    initiateArbitrumFork();
    setUpBase();
  }

  function testMockGatewayLogic() public {
    require(IERC20(renbtc).balanceOf(address(this)) != 0, "not being minted");
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
