// SPDX-License-Identifier: MIT

pragma solidity >=0.8.7 <0.9.0;
import { ERC20PermitUpgradeable } from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol";
import { ERC20CappedUpgradeable, ERC20Upgradeable } from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20CappedUpgradeable.sol";
import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract ZERO is OwnableUpgradeable, ERC20CappedUpgradeable, ERC20PermitUpgradeable {
  function initialize(uint256 _cap) public initializer {
    __ERC20Permit_init("ZERO");
    __ERC20_init_unchained("ZERO", "ZERO");
    __Ownable_init_unchained();
    __ERC20Capped_init_unchained(_cap);
  }

  function _mint(address account, uint256 amount) internal override(ERC20Upgradeable, ERC20CappedUpgradeable) {
    ERC20CappedUpgradeable._mint(account, amount);
  }

  function mint(address account, uint256 amount) public onlyOwner {
    _mint(account, amount);
  }

  function burn(address account, uint256 amount) public onlyOwner {
    _burn(account, amount);
  }
}
