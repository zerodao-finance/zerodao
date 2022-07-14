import { ethers } from "ethers";
import { ETHEREUM, ARBITRUM, MATIC } from "zero-protocol/dist/lib/fixtures";
export const NETWORK_ROUTER = {
  137: {
    ...MATIC,
    name: "Polygon",
    swap_address: "0x751B1e21756bDbc307CBcC5085c042a0e9AaEf36",
  },
  42161: {
    ...ARBITRUM,
    name: "Arbitrum",
    swap_address: "0x960ea3e3C7FB317332d990873d354E18d7645590",
  },
  1: {
    ...ETHEREUM,
    name: "Mainnet",
    swap_address: "0x80466c64868E1ab14a1Ddf27A676C3fcBE638Fe5",
  },
};
