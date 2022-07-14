import { ethers } from "ethers";
import { tokenMapping } from "../utils/tokenMapping";
import { makeCompute } from "zero-protocol/lib/badger";

function formatOutput(token, output) {
  switch (token) {
    case "USDC":
      return ethers.utils.formatUnits(output, 6);
    case "ETH":
      return ethers.utils.formatEther(output);
    case "AVAX":
      return ethers.utils.formatEther(output);
    case "MATIC":
      return ethers.utils.formatEther(output);
    default:
      return ethers.utils.formatUnits(output, 8);
  }
}

export async function getFeeBreakdown({ amount, chainId }) {
  const { applyFee, mintFee, renVmFeeMint } = makeCompute(chainId);

  var fees = await applyFee(
    ethers.utils.parseUnits(amount, 8),
    mintFee,
    renVmFeeMint
  );

  fees.gasFee = formatOutput("WBTC", fees.gasFee);
  fees.opFee = formatOutput("WBTC", fees.opFee);
  fees.totalFees = formatOutput("WBTC", fees.totalFees);
  return fees;
}

export async function getTransferOutput({ token, amount, chainId }) {
  const { computeTransferOutput } = makeCompute(chainId);

  const input = {
    module: tokenMapping({ tokenName: token, chainId }),
    amount: ethers.utils.parseUnits(amount, 8),
  };
  let output = await computeTransferOutput(input);
  output = formatOutput(token, output);
  return output;
}
