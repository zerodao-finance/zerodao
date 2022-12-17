import { hexlify } from "@ethersproject/bytes";
import { Buffer } from "buffer";

export function isZcashAddress(hex) {
  return Buffer.from(hexlify(hex).substr(2), "hex").toString("utf8")[0] === "t";
}

export function getRenAssetName(request) {
  return isZcashAddress(request.destination) ? "renZEC" : "renBTC";
}

export function toFixtureName(chainId) {
  switch (chainId) {
    case 1:
      return "ETHEREUM";
    case 137:
      return "MATIC";
    case 43114:
      return "AVALANCHE";
    case 42161:
      return "ARBITRUM";
    case 10:
      return "OPTIMISM";
  }
}
