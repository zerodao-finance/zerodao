export declare const returnChainDetails: (CHAINID: any, _provider: any) => {
    name: string;
    provider: any;
    uniswapName: string;
};
export declare function makeQuoter(CHAIN: string, provider: any): {
    fromUSDC: (amount: any) => Promise<any>;
    getAVAXQuote: (direction: any, amount: any) => Promise<any>;
    getRenBTCForOneETHPrice: () => Promise<any>;
    getUsdcQuoteAVAX: (direction: any, amount: any) => Promise<any>;
    wNativeToUSDC: (amount: any) => Promise<any>;
    getWbtcQuote: (direction: any, amount: any) => Promise<any>;
    renBTCToETH: (amount: any) => Promise<any>;
    toUSDC: (amount: any) => Promise<any>;
    ETHtoRenBTC: (amount: any) => Promise<any>;
    chain: {
        name: string;
        provider: any;
        uniswapName: string;
    };
};
