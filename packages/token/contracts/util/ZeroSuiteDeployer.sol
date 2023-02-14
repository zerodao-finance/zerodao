// SPDX-License-Identifier: MIT

pragma solidity >=0.8.7 <0.9.0;

import { TransparentUpgradeableProxy } from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import { ProxyAdmin } from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import { ZERO } from "../token/ZERO.sol";
import { sZERO } from "../token/sZERO.sol";
import { ZeroGovernor } from "../governance/ZeroGovernor.sol";
import { ZEROFROST } from "../zero/ZEROFROST.sol";

contract ZeroSuiteDeployer {
  event Deployment(address indexed proxy);
  address constant proxyadmin = 0xFF727BDFa7608d7Fd12Cd2cDA1e7736ACbfCdB7B;
  address constant multisig = 0x5E9B37149b7d7611bD0Eb070194dDA78EB11EfdC;

  constructor() {
    address logic = address(new ZERO());
    address zero = address(
      new TransparentUpgradeableProxy(logic, proxyadmin, abi.encodeWithSelector(ZERO.initialize.selector))
    );
    emit Deployment(zero);

    logic = address(new ZEROFROST());
    address zerofrost = address(
      new TransparentUpgradeableProxy(logic, proxyadmin, abi.encodeWithSelector(ZEROFROST.initialize.selector))
    );
    emit Deployment(zerofrost);

    logic = address(new sZERO());
    address szero = address(
      new TransparentUpgradeableProxy(
        logic,
        proxyadmin,
        abi.encodeWithSelector(sZERO.initialize.selector, zero, zerofrost, multisig, (1 ether / 50000000), 0)
      )
    );
    emit Deployment(szero);

    logic = address(new ZeroGovernor());
    address gov = address(
      new TransparentUpgradeableProxy(
        logic,
        proxyadmin,
        abi.encodeWithSelector(ZeroGovernor.initialize.selector, szero)
      )
    );
    emit Deployment(gov);

    ZERO(zero).mint(multisig, 88000000 ether);

    ZERO(zero).changeSZero(szero);

    selfdestruct(payable(msg.sender));
  }
}
