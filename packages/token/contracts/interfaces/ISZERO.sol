// SPDX-License-Identifier: MIT

pragma solidity >=0.8.7 <0.9.0;

import { IERC20PermitUpgradeable } from "@openzeppelin/contracts-upgradeable-new/token/ERC20/extensions/draft-IERC20PermitUpgradeable.sol";
import { IERC20Upgradeable } from "@openzeppelin/contracts-upgradeable-new/token/ERC20/IERC20Upgradeable.sol";

interface ISZERO {
  function updateZAssetReward(uint256 idx, uint256 amount) external;
}
