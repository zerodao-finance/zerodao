import { BigNumberish } from "@ethersproject/bignumber";
//import { SignerWithAddress } from 'hardhat-deploy-ethers/dist/src/signer-with-address';
import { EIP712TypedData } from "@0x/types";

export interface GatewayAddressInput {
  isTest: boolean; //
}
export interface PHashInput {
  to: string;
  nonce: BigNumberish;
  module: string;
  data: string;
}

export interface GHashInput {
  to: string;
  tokenAddress: string;
  p: string;
  nonce: string;
}

export interface NHashInput {
  txHash: string;
  vOut: BigNumberish;
  nonce: string;
}

export interface DarknodeSignatureInput {
  p: string | PHashInput;
  n: string | NHashInput;
  amount: BigNumberish;
  to: string;
  tokenAddress: string;
}

// export type ConnectionTypes = ZeroConnection;

export type RequestStates = "pending" | "failed" | "succeeded";

export type RequestWithStatus<T = Record<string, any>> = T & {
  status: RequestStates;
};
