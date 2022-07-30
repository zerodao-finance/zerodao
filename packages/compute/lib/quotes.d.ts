import { Contract } from "@ethersproject/contracts";
import { JsonRpcProvider } from "@ethersproject/providers";
declare type Chain = {
    name: string;
    uniswapName: string;
    chainId: string;
    provider: JsonRpcProvider;
};
export declare function makeQuoter(CHAIN: string, provider: any): void;
export declare class Quoter {
    static makeQuoter(chain: string, provider: JsonRpcProvider): Quoter;
    chain: Chain;
    provider: JsonRpcProvider;
    quoter: Contract;
    renCrv: Contract;
    constructor(chain: Chain, provider: JsonRpcProvider);
    getAVAXQuote(direction: any, amount: any): Promise<import("ethers").BigNumber>;
    getUsdcquoteAVAX(direction: any, amount: any): Promise<any>;
    getWbtcQuote(direction: any, amount: any): Promise<any>;
}
export {};
