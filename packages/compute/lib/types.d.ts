import { JsonRpcProvider } from "@ethersproject/providers";
export declare type Chain = {
    name: string;
    uniswapName: string;
    chainId: string;
    provider: JsonRpcProvider;
};
