import { Service } from "../rpc/service";
import { Peer } from "../p2p";
export declare class MempoolReactor extends Service {
    gossipService: string;
    canGossip: boolean;
    p2p: Peer;
    proxy: any;
    gossip: any;
    constructor({ proxyApp, peer, canGossip }: any);
    setCanGossip(): Promise<void>;
    zero_sendTransaction(call: any, callback: any): Promise<void>;
}
