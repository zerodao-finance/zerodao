export declare function selectFixture(chainId: any): any;
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
