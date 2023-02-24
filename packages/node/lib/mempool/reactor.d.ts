import { Mempool } from "./mempool";
import { Peer } from "../p2p";
export type MempoolReactor = {
    proxy: Mempool;
    serviceMethods: string[];
    canGossip?: boolean;
    gossip: undefined | any;
    new (proxy: Mempool, p2p: Peer): MempoolReactor;
    zero_sendTransaction(call: any, callback: any): void;
    initTxGossip(): Promise<void>;
};
export declare function MempoolReactor(proxy: any, p2p: any): void;
