import { JsonRpcProvider } from "@ethersproject/providers";
export type Chain = {
    name: string;
    uniswapName: string;
    chainId: string;
    provider: JsonRpcProvider;
};
