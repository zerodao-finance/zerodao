export declare const burnFee: any;
export declare const mintFee: any;
export declare const renVmFee: any;
export declare const makeCompute: (CHAIN?: string) => {
    computeTransferOutput: ({ module, amount }: {
        module: any;
        amount: any;
    }) => Promise<any>;
    computeOutputBTC: (burnRequest: any) => Promise<any>;
    applyFee: (amountIn: any, burnFee?: any, multiplier?: any) => Promise<{
        gasFee: any;
        zeroProtocolFeeAmt: any;
        renVmFeeAmt: any;
        opFee: any;
        totalFees: any;
    }>;
    computeRenBTCGasFee: (gasCost: any, gasPrice: any) => Promise<any>;
    getConvertedAmount: (asset: any, amount: any) => Promise<any>;
};
