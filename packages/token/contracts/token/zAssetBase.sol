// SPDX-License-Identifier: MIT

pragma solidity >=0.8.7 <0.9.0;
import { ERC20PermitUpgradeable } from "@openzeppelin/contracts-upgradeable-new/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol";
import { ERC20CappedUpgradeable, ERC20Upgradeable } from "@openzeppelin/contracts-upgradeable-new/token/ERC20/extensions/ERC20CappedUpgradeable.sol";
import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable-new/access/OwnableUpgradeable.sol";
import {ISZERO} from "../interfaces/ISZERO.sol";

contract ZERO is OwnableUpgradeable, ERC20PermitUpgradeable {
  address _szero;
  uint256 _idx;
  modifier onlysZeroOrOwner() {
    require(msg.sender == owner() || msg.sender == _szero);
    _;
  }

  function initialize(address sZERO) public initializer {
    __ERC20Permit_init("ZERO");
    __ERC20_init_unchained("ZERO", "ZERO");
    __Ownable_init_unchained();
    _szero = sZERO;
  }

  function changeSZero(address sZero) public onlyOwner {
    _szero = sZero;
  }

  function changeIdx(uint256 idx) public onlyOwner {
    _idx = idx;
  }

  function mint(address account, uint256 amount) public onlysZeroOrOwner {
    _mint(account, amount);
    ISZERO(_szero).updateZAssetReward(_idx, amount);
  }

  function burn(address account, uint256 amount) public onlysZeroOrOwner {
    _burn(account, amount);
    ISZERO(_szero).updateZAssetReward(_idx, amount);
  }
}