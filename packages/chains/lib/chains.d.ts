export declare const getChainName: (chainId: any) => "Avalanche" | "Arbitrum" | "Polygon" | "Optimism" | "Mainnet" | "Unsupported Chain";
export declare const getExplorerRoot: (chainId: any) => "https://etherscan.io/address/" | "https://snowtrace.io/address/" | "https://polygonscan.com/address/" | "https://optimistic.etherscan.io/address/" | "https://arbiscan.io/address/";
export declare const CHAINS: {
    1: {
        chainId: string;
        chainName: string;
        nativeCurrency: {
            name: string;
            symbol: string;
            decimals: number;
        };
        rpcUrls: string[];
        blockExplorerUrls: string[];
    };
    10: {
        chainId: string;
        chainName: string;
        nativeCurrency: {
            name: string;
            symbol: string;
            decimals: number;
        };
        rpcUrls: string[];
        blockExplorerUrls: string[];
    };
    42161: {
        chainId: string;
        chainName: string;
        nativeCurrency: {
            name: string;
            symbol: string;
            decimals: number;
        };
        rpcUrls: string[];
        blockExplorerUrls: string[];
    };
    43114: {
        chainId: string;
        chainName: string;
        nativeCurrency: {
            name: string;
            symbol: string;
            decimals: number;
        };
        rpcUrls: string[];
        blockExplorerUrls: string[];
    };
    137: {
        chainId: string;
        chainName: string;
        nativeCurrency: {
            name: string;
            symbol: string;
            decimals: number;
        };
        rpcUrls: string[];
        blockExplorerUrls: string[];
    };
};
export declare const URLS: {};
