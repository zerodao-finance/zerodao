pragma solidity >=0.8.13;

import "../erc4626/interfaces/IZeroBTC.sol";
import "./Reverts.test.sol";

contract BTCVaultTestMainnet is RevertTest {
  constructor() {}

  function testMockGatewayLogic() public {
    mintRenBtc(1);
    assertEq(IERC20(renbtc).balanceOf(address(this)), 1, "RenBTC not being minted");
  }

  function testModuleTypes() public {
    vault.addModule(moduleETH, ModuleType.LoanAndRepayOverride, 1000, 1000);
    vault.removeModule(moduleETH);
  }
}
