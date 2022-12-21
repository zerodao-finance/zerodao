export declare const TRANSACTIONS_TYPE: {
  readonly TRANSFER: 0;
  readonly SLASH: 1;
};
export declare const CHAINS: {
  readonly ETHEREUM: "https://rpc.flashbots.net";
};
export declare class Transaction {
  constructor({ type, to, data, nonce, signature, chain }: any);
}
