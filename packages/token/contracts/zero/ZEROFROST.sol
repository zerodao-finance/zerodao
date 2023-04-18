// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { IZEROFROST } from "../interfaces/IZEROFROST.sol";
import { ZEROFROSTStorage } from "./ZEROFROSTStorage.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// dummy contract to just return epoch length for now
contract ZEROFROST is ZEROFROSTStorage, IZEROFROST {
  function initialize() public initializer {
    __Ownable_init_unchained();
    __ERC721_init_unchained("ZEROFROST", "ZFRST");
  }

  function epoch() public view returns (uint256) {
    return 0;
  }

  function nextEpoch() public view returns (uint256) {
    return 0;
  }

  function epochLength() public view returns (uint256) {
    return 3600 * 24 * 180;
  }

  function addWrappedAsset(address asset) public onlyOwner {
    assets.push(asset);
  }

  function addAcceptedCollateral(address input) public onlyOwner {
    _acceptsCollateral[input] = true;
    _acceptedCollaterals.push(input);
  }

  function acceptsCollateral(address input) public view returns (bool) {
    return _acceptsCollateral[input];
  }

  function getAcceptedCollateral() external view returns (address memory _acceptedCollaterals) {
    for (uint256 i = 0; i < acceptedCollaterals.length; i++) {
      _acceptedCollaterals[i] = acceptedCollaterals[i];
    }
  }

  function _convertAssetToETH(address asset, uint256 totalSupply) internal returns (uint256) {}

  function _convertCollateralToETH(address asset, uint256 supply) internal returns (uint256) {}

  function purchase(
    address[] memory inputCollateral,
    uint256[] memory inputCollateralAmounts,
    bytes memory blsPubKey
  ) public {
    for (uint256 i = 0; i < inputCollateral.length; i++) {
      address input = inputCollateral[i];
      require(_acceptsCollateral[input], "Currently not accepting token as collateral");
      IERC20(input).transferFrom(_msgSender(), address(this), inputCollateralAmounts[i]);
    }
    bytes32 tokenId = keccak256(blsPubKey);
    bonds[tokenId] = Bond({ inputCollateral: inputCollateral, inputCollateralAmounts: inputCollateralAmounts });
    _mint(tokenId, _msgSender());
  }

  function collateral(bytes memory blsPubKey)
    public
    view
    returns (address[] memory inputCollateral, uint256[] memory inputCollateralAmounts)
  {
    Bond memory _bond = bonds[keccak256(blsPubKey)];
    inputCollateral = _bond.inputCollateral;
    inputCollateralAmounts = _bond.inputCollateralAmounts;
  }

  function canLeaveAfter(bytes memory blsPubKey) public view returns (uint256 timestamp) {}

  function collateralValueInETH() public view returns (address[] memory _assets, uint256[] memory totalValue) {
    _assets = new address[](acceptedCollateral.length);
    totalValue = new uint256[](_assets.length);
    for (uint256 i = 0; i < _assets.length; i++) {
      _assets[i] = acceptedCollateral[i];
      totalValue[i] = _convertCollateralToETH(_assets[i], IERC20(_assets[i]).balanceOf(address(this)));
    }
  }

  function wrappedAssetValueInETH() public view returns (address[] memory _assets, uint256[] memory totalValue) {
    _assets = new address[](assets.length);
    totalValue = new uint256[](_assets.length);
    for (uint256 i = 0; i < _assets.length; i++) {
      _assets[i] = assets[i];
      totalValue[i] = _convertAssetToETH(_assets[i], IERC20(_assets[i]).totalSupply());
    }
  }
}
