import { type BytesLike } from "@ethersproject/bytes";
export type Transaction = {
  chainId: number;
  to: string;
  data: string;
};

export type QueryTXResult = {
  amount: string;
  nHash: BytesLike;
  pHash: BytesLike;
  signature: BytesLike;
};
