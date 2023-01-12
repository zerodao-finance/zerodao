// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { ERC20Upgradeable } from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract sZERO is ERC20Upgradeable, OwnableUpgradeable {
  address _masterchef;

  function initialize() public initializer {
    __ERC20_init_unchained("sZERO", "sZERO");
    __Ownable_init_unchained();
    _masterchef = msg.sender;
  }

  function setMasterChef(address masterChef) public onlyOwner {
    _masterchef = masterChef;
  }

  modifier onlyChef() {
    require(msg.sender == _masterchef, "Not masterchef");
    _;
  }

  function transferFrom(
    address from,
    address to,
    uint256 amount
  ) public override onlyOwner returns (bool) {
    return true;
  }

  function transfer(address to, uint256 amount) public override onlyChef returns (bool) {
    address owner = _msgSender();
    _transfer(owner, to, amount);
    return true;
  }

  function mint(address to, uint256 amount) public onlyChef {
    _mint(to, amount);
  }

  function burn(address account, uint256 amount) public onlyChef {}
}
