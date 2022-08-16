export declare function selectFixture(chainId: any): {
    renBTC: string;
    wETH: string;
    wNative: string;
    btcGateway: string;
    USDC: string;
    WBTC: string;
    Router: string;
    sushiRouter: string;
    Curve_Ren: string;
    gatewayRegistry: string;
    safeProxyFactory: string;
    multiSend: string;
    safeMasterCopy: string;
} | {
    AVAX: string;
    renBTC: string;
    Curve_Ren: string;
    aTricrypto: string;
    WBTC: string;
    USDC: string;
    Curve_SBTC: string;
    Curve_TriCryptoTwo: string;
    Router: string;
    btcGateway: string;
} | {
    USDC: string;
    Optimism: string;
    wNative: string;
    wETH: string;
    WBTC: string;
    btcGateway: string;
    Router: string;
    ETH: string;
    renBTC: string;
    Curve_Ren: string;
};
export declare function getChainUnits({ amount, tokenName }: {
    amount: any;
    tokenName: any;
}): string;
export declare const getChainIdToName: {
    1: string;
    42161: string;
    137: string;
    43114: string;
    10: string;
};
export declare const chainIdToNetworkName: (chainId: any) => any;
export declare function tokenMapping({ tokenName, chainId }: {
    tokenName: any;
    chainId: any;
}): any;
export declare function reverseTokenMapping({ tokenAddress, chainId }: {
    tokenAddress: any;
    chainId: any;
}): string;
