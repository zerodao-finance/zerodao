import { BigNumber } from "@ethersproject/bignumber";
export declare const keeperReward: BigNumber;
export declare function applyRatio(amount: any, ratio: any): BigNumber;
export declare const getChainNameFixture: (chainName: any) => any;
export declare function makeQuoter(CHAIN?: string, provider?: any): {
    fromUSDC: (amount: any) => Promise<any>;
    getAVAXQuote: (direction: any, amount: any) => Promise<any>;
    getRenBTCForOneETHPrice: () => Promise<any>;
    getUsdcQuoteAVAX: (direction: any, amount: any) => Promise<any>;
    wNativeToUSDC: (amount: any) => Promise<any>;
    getWbtcQuote: (direction: any, amount: any) => Promise<any>;
    renBTCToETH: (amount: any) => Promise<any>;
    ETHToRenZEC: (amount: any) => Promise<BigNumber>;
    renZECToETH: (amount: any) => Promise<BigNumber>;
    getRenZECUSDCQuote: (direction: any, amount: any) => Promise<any>;
    getRenZECUSDTQuote: (direction: any, amount: any) => Promise<any>;
    toUSDC: (amount: any) => Promise<any>;
    getUSDCNativeQuote: (direction: any, amount: any) => Promise<any>;
    ETHtoRenBTC: (amount: any) => Promise<any>;
    chain: {
        provider: any;
        name: any;
        uniswapName: any;
        chainId: number;
    };
    getUSDTQuote: (direction: any, amount: any) => Promise<any>;
};
export declare function makeCompute(CHAIN?: string): {
    computeTransferOutput: ({ module, amount, primaryToken }: {
        module: any;
        amount: any;
        primaryToken: any;
    }) => Promise<any>;
    computeOutputBTC: (burnRequest: any) => Promise<any>;
    applyFee: (amountIn: any, zeroFee: any, renVmFee: any, primaryToken: any) => Promise<{
        gasFee: any;
        zeroProtocolFeeAmt: BigNumber;
        renVmFeeAmt: BigNumber;
        renVmBtcNetworkFee: any;
        opFee: BigNumber;
        totalFees: any;
    }>;
    burnFee: BigNumber;
    mintFee: BigNumber;
    renVmFeeBurn: BigNumber;
    renVmFeeMint: BigNumber;
    computeRenBTCGasFee: (gasCost: any, gasPrice: any) => Promise<any>;
    getConvertedAmount: (asset: any, amount: any, primaryToken: any) => Promise<any>;
};
