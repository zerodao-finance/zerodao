// SPDX-License-Identifier: MIT

pragma solidity >=0.8.7 <0.9.0;

import { TransparentUpgradeableProxy } from "@openzeppelin/contracts/proxy/TransparentUpgradeableProxy.sol";
import { ProxyAdmin } from "@openzeppelin/contracts/proxy/ProxyAdmin.sol";
import { ZERO } from "../token/ZERO.sol";
import { sZERO } from "../token/sZERO.sol";
import { ZeroGovernor } from "../governance/ZeroGovernor.sol";
import { ZEROFROST } from "../zero/ZEROFROST.sol";

contract ZeroSuiteDeployer {
  event Deployment(address indexed proxy);
  address constant proxyadmin;
  address constant multisig;

  constructor() {
    address logic = new ZERO();
    address zero = address(
      new TransparentUpgradeableProxy(logic, proxyadmin, abi.encodeWithSelector(ZERO.initialize.selector))
    );
    emit Deployment(zero);

    logic = new ZEROFROST();
    address zerofrost = address(
      new TransparentUpgradeableProxy(logic, proxyadmin, abi.encodeWithSelector(ZEROFROST.initialize.selector))
    );
    emit Deployment(zerofrost);

    logic = new sZERO();
    address szero = address(
      new TransparentUpgradeableProxy(
        logic,
        proxyadmin,
        abi.encodeWithSelector(sZERO.initialize.selector, zero, zerofrost, multisig, (1 ether / 50000000), 0)
      )
    );

    //TODO: setup timelockcontroller

    logic = new ZeroGovernor();

    selfdestruct(msg.sender);
  }
}
