import { ethers } from "ethers";

import fixtures from "zero-protocol/lib/fixtures";

const getRenBTCAddress = async (signer) => {
  const { chainId } = await signer.provider.getNetwork();
  return fixtures[
    (() => {
      switch (Number(chainId)) {
        case 1:
          return "ETHEREUM";
        case 42161:
          return "ARBITRUM";
        case 137:
          return "MATIC";
        case 43114:
          return "AVALANCHE";
      }
    })()
  ].renBTC;
};

export const fallbackMint = async (request, signer) => {
  try {
    request.getController = async () =>
      new ethers.Contract(
        request.contractAddress,
        [
          "function fallbackMint(address, address, address, uint256, uint256, uint256, address, bytes32, bytes, bytes)",
        ],
        signer
      );

    request.asset = await getRenBTCAddress(signer);
    const address = await signer.getAddress();
    request.destination = () => address;
    await request.fallbackMint(signer);
  } catch (error) {
    console.error("error running fallback mint");
  }
};
