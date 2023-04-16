// SPDX-License-Identifier: MIT

pragma solidity >=0.8.7 <0.9.0;
import "@openzeppelin/contracts-upgradeable-new/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable-new/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable-new/token/ERC721/ERC721Upgradeable.sol";

contract ZEROFROSTStorage is Initializable, OwnableUpgradeable, ERC721Upgradeable {
  struct Bond {
    address[] inputCollateral;
    uint256[] inputCollateralAmounts;
  }

  mapping(bytes32 => Bond) bonds;
  mapping(address => bool) _acceptsCollateral;
  address[] acceptedCollateral;

  constructor() ERC721Upgradeable("ZEROFROST", "ZFRST") {}
}
