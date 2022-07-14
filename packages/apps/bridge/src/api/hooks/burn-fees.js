import { ethers } from "ethers";
import { makeCompute } from "zero-protocol/lib/badger";
import { tokenMapping } from "../utils/tokenMapping";

function processAmount(amount, token) {
  switch (token) {
    case "ETH":
      return ethers.utils.parseEther(amount);
    case "AVAX":
      return ethers.utils.parseEther(amount);
    case "MATIC":
      return ethers.utils.parseEther(amount);
    case "USDC":
      return ethers.utils.parseUnits(amount, 6);
    default:
      return ethers.utils.parseUnits(amount, 8);
  }
}

function formatOutput(output) {
  return ethers.utils.formatUnits(output, 8);
}

export async function getFeeBreakdown({ amount, token, chainId }) {
  const { getConvertedAmount, applyFee, burnFee, renVmFeeBurn } =
    makeCompute(chainId);

  const tokenAddress = tokenMapping({ tokenName: token, chainId });
  const convertedAmount = await getConvertedAmount(
    tokenAddress,
    processAmount(amount, token)
  );
  var fees = await applyFee(convertedAmount, burnFee, renVmFeeBurn);

  fees.gasFee = formatOutput(fees.gasFee);
  fees.opFee = formatOutput(fees.opFee);
  fees.totalFees = formatOutput(fees.totalFees);
  return fees;
}

export async function getBurnOutput({ amount, token, chainId }) {
  const { computeOutputBTC } = makeCompute(chainId);

  const input = {
    asset: tokenMapping({ tokenName: token, chainId }),
    amount: processAmount(amount, token),
  };
  let output = await computeOutputBTC(input);
  output = formatOutput(output);
  return output;
}
