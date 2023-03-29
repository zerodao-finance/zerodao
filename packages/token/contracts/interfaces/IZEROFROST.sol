// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// ERC721 contract that issues an NFT representing a FROST signer's bond and active collateral.

interface IZEROFROST {
  // Current epoch number. ZEROFROST holders which have acquired a bond for the current epoch remain locked until the next epoch after the one which they call `goodbye(bytes)`. Epochs begin at 0 and increment deterministically.
  function epoch() external view returns (uint256);

  // Returns the UNIX timestamp representing the point where ZEROFROST holders can rotate the FROST public key and become eligible to exit with their rewards.
  function nextEpoch() external view returns (uint256);

  function epochLength() external view returns (uint256);

  // Sets the amount of time added to `nextEpoch` when the next round is triggered.
  // function setEpochLength(uint256) external;

  // // Returns the amount of ZERO tokens required to acquire a bond. Configurable by on-chain governance with the `setPrincipal(uint256)` function.
  // function principal() external view returns (uint256 requiredZeroTokens);

  // // Returns true if an asset can be used as collateral associated with a bond.
  // function acceptsCollateral(address) external view returns (bool canUse);

  // // Returns the list of contract addresses for all collateral supported by ZEROFROST.
  // function getAcceptedCollateral() external view returns (address[] memory);

  // // Acquire a ZEROFROST NFT and become eligible to be included in FROST. When the ZERO network is forming a FROST ring, it will prefer ZEROFROST holders with the most collateral. ZEROFROST holders who did not get awarded a secret share during DKG will still be locked until the next epoch, but will earn rewards the same based on their collateral.
  // // The ID of the NFT received from a purchase is always `keccak256(blsPubKey))``
  // function purchase(
  //   address[] memory inputCollateral,
  //   uint256[] memory inputCollateralAmounts,
  //   bytes memory blsPubKey
  // ) external;

  // // Returns the amount of collateral for each asset staked, for a given ZEROFROST bond.
  // function collateral(bytes memory blsPubKey) external view returns (address[] memory assets, uint256[] memory qtys);

  // // Returns the total value of each collateral asset held in terms of ETH. Used to determine distribution of rewards awarded to ZEROFROST bonds as they are redeemed.
  // function collateralValueInETH() external view returns (address[] memory assets, uint256[] memory totalValue);

  // // Returns the total value of active wrapped assets which exist, in terms of ETH. Used to determine the amount of collateral distributed in a liquidation scenario, for any given default asset that is eligible to be burned for collateral.
  // function wrappedAssetValueInETH() external view returns (address[] memory assets, uint256[] memory totalValue);

  // // Signal your intent to leave the FROST ring and abdicate your responsibility as a signer. But, you can't leave yet! You have to keep signing until the next epoch is triggered.

  // // Without calling this function, whether or not your node is online to participate in DKG, your ZEROFROST bond will still have its collateral on the line, and you will still earn rewards.
  // function goodbye(bytes memory blsPubKey) external;

  // // Returns a UNIX timestamp representing when a ZEROFROST bond is considered inactive and eligible to call `redeem(bytes)`.
  // function canLeaveAfter(bytes memory blsPubKey) external view returns (uint256 timestamp);

  // // Trade in a ZEROFROST NFT for the input collateral and any rewards accrued (proportional to collateral)
  // function redeem(bytes memory blsPubKey) external;

  // // Queues the next FROST pubkey to be activated after the next epoch is triggered.
  // function rotate(bytes memory frostPubKey) external;

  // // To be used in the event that FROST fails, either due to more than 33% of active signers dropping from the ZERO network, or otherwise if FROST colludes to steal assets backing wrapped assets.
  // // In ideal conditions, this function will never be called, but if it is, in order to make sure wrapped assets can all be recovered no matter where they exist, a new wrapped asset will be factoried up for each asset and the GatewayRegistry updated to reflect the new addresses. Old wrapped assets will be able to be redeemed for the proportion of FROST collateral from the compromised FROST ring.
  // function liquidate() external;

  // // Exchange all assets which were backed by a liquidated FROST ring for the proportional amount of FROST collateral.
  // function collect(uint256 epoch) external;
}
