import { Chain, InputType, OutputType } from "@renproject/utils";
/**
 * Detect whether the transaction is a lock-and-mint, burn-and-release or
 * burn-and-mint, and return the selector.
 */
export declare const getInputAndOutputTypes: ({ asset, fromChain, toChain, }: {
    asset: string;
    fromChain: Chain;
    toChain: Chain;
}) => Promise<{
    inputType: InputType;
    outputType: OutputType;
    selector: string;
}>;
