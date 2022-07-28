import { Polygon, Ethereum, Arbitrum, Avalanche, Optimism, EthereumBaseChain } from "@renproject/chains";
import { JsonRpcProvider } from "@ethersproject/providers";
export declare const CONTROLLER_DEPLOYMENTS: {
    [x: string]: string;
};
export declare const RPC_ENDPOINTS: {
    Arbitrum: string;
    Avalanche: string;
    Polygon: string;
    Ethereum: string;
    Optimism: string;
    localhost: string;
};
export declare const RENVM_PROVIDERS: {
    Arbitrum: typeof Arbitrum;
    Polygon: typeof Polygon;
    Ethereum: typeof Ethereum;
    Avalanche: typeof Avalanche;
    Optimism: typeof Optimism;
};
export declare const getVanillaProvider: (request: any) => JsonRpcProvider;
export declare const getRenVMChain: (transferRequest: any) => any;
export declare const getProvider: ({ contractAddress: string }: {
    contractAddress: any;
}) => EthereumBaseChain;
export declare const logger: {
    debug(v: any): void;
};
