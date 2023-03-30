// SPDX-License-Identifier: MIT

pragma solidity >=0.8.7 <0.9.0;
import { ERC20PermitUpgradeable } from "@openzeppelin/contracts-upgradeable-new/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol";
import { ERC20CappedUpgradeable, ERC20Upgradeable } from "@openzeppelin/contracts-upgradeable-new/token/ERC20/extensions/ERC20CappedUpgradeable.sol";
import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable-new/access/OwnableUpgradeable.sol";
import { ISZERO } from "../interfaces/ISZERO.sol";

abstract contract ZAssetBase is OwnableUpgradeable, ERC20PermitUpgradeable {
  address _gateway;
  address _szero;
  uint256 _idx;
  mapping(address => bool) _isPrecompiled;
  modifier onlyGatewayOrOwner() {
    require(msg.sender == owner() || msg.sender == _szero);
    _;
  }

  function initialize(address sZERO, address gateway) public initializer {
    __ERC20Permit_init("ZERO");
    __ERC20_init_unchained("ZERO", "ZERO");
    __Ownable_init_unchained();
    _szero = sZERO;
    _gateway = gateway;
  }

  function changeSZero(address sZero) public onlyOwner {
    _szero = sZero;
  }

  function changeGateway(address gateway) public onlyOwner {
    _gateway = gateway;
  }

  function changeIdx(uint256 idx) public onlyOwner {
    _idx = idx;
  }

  function mint(
    address account,
    bytes32 pHash,
    bytes32 nHash,
    uint256 amount,
    bytes memory signature
  ) public virtual {
    //TODO: write signature verification
    _mint(account, amount);
    ISZERO(_szero).updateZAssetReward(_idx, amount);
  }

  function burn(
    uint256 amount,
    bytes memory blsPubKey,
    bytes memory data
  ) public virtual {
    //TODO: write signature verification
    _burn(msg.sender, amount);
    ISZERO(_szero).updateZAssetReward(_idx, amount);
  }
}
