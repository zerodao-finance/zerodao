import type { Libp2pOptions } from "libp2p";
import { Libp2pNode as Libp2p } from "../../../node_modules/libp2p/dist/src/libp2p";
import { Signer } from "@ethersproject/abstract-signer";
import PeerId from "peer-id";
import { Logger } from "@zerodao/logger";
interface ZeroP2POptions extends Libp2pOptions {
    multiaddr: "dev-mainnet" | "mainnet";
    signer: any;
}
export declare class ZeroP2P extends Libp2p {
    _keepers: Array<string>;
    logger: Logger;
    signer: Signer;
    addressPromise: Promise<string>;
    static PRESETS: {
        MAINNET: string;
        "DEV-MAINNET": string;
    };
    static fromPresetOrMultiAddr(multiaddr: any): any;
    static toMessage(password: any): string;
    static peerIdFromSeed(seed: any): Promise<PeerId>;
    static fromSeed({ signer, seed, multiaddr }: {
        signer: any;
        seed: any;
        multiaddr: any;
    }): Promise<ZeroP2P>;
    static fromPassword({ signer, multiaddr, password }: {
        signer: any;
        multiaddr: any;
        password: any;
    }): Promise<ZeroP2P>;
    start(): Promise<void>;
    setSigner(signer: any): void;
    constructor(options: ZeroP2POptions);
    subscribeKeepers(): Promise<void>;
    unsubscribeKeepers(): Promise<void>;
}
export {};
