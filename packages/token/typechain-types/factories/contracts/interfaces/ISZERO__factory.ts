/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  ISZERO,
  ISZEROInterface,
} from "../../../contracts/interfaces/ISZERO";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "idx",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "updateZAssetReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class ISZERO__factory {
  static readonly abi = _abi;
  static createInterface(): ISZEROInterface {
    return new utils.Interface(_abi) as ISZEROInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): ISZERO {
    return new Contract(address, _abi, signerOrProvider) as ISZERO;
  }
}
