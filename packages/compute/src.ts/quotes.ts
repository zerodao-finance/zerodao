import { Contract } from "@ethersproject/contracts";
import { JsonRpcProvider } from "@ethersproject/providers";
import { parseEther } from "@ethersproject/units";
import { FIXTURES } from "@zerodao/constants";
import JOE from "@traderjoe-xyz/sdk";

export function makeQuoter(CHAIN = "1", provider) {
    let chain; // = function that returns chain details
    /**
     * name: string = "ETHEREUM"
     * chianId: string = "1"
     * provider: providerv = provider("mainnet")
     * uniswapName: string = "MAINNET"
     */
}

class Quoter {
    static makeQuoter(chain = "1", provider: JsonRpcProvider) {
        return new Quoter(chain, provider)
    }

    chain: string;
    provider: JsonRpcProvider;
    quoter: Contract
    renCrv: Contract
    constructor(chain = "1", provider: JsonRpcProvider) {
        this.chain = chain
        this.provider = provider

        this.quoter = new Contract(
            "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
            [
                "function quoteExactInputSingle(address tokenIn, address tokenOut, uint24 fee, uint256 amountIn, uint160 sqrtPriceLimitX96) public view returns (uint256 amountOut)",
                "function quoteExactInput(bytes path, uint256 amountIn) public view returns (uint256 amountOut)",
            ],
            provider
        )

        this.renCrv = new Contract(
            "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
            [
                "function quoteExactInputSingle(address tokenIn, address tokenOut, uint24 fee, uint256 amountIn, uint160 sqrtPriceLimitX96) public view returns (uint256 amountOut)",
                "function quoteExactInput(bytes path, uint256 amountIn) public view returns (uint256 amountOut)",
            ],
            provider
        )
    }


    async getAVAXQuote(direction, amount) {
        const WBTC = new JOE.Token(
            JOE.ChainId.AVALANCHE,
            FIXTURES.AVALANCHE.WBTC,
            8
        );

        const pair = await JOE.Fetcher.fetchPairData(
            WBTC,
            JOE.WAVAX[JOE.ChainId.AVALANCHE],
            this.provider
        );

        if (direction) {
            const wbtcAmount = await this.getWbtcQuote(true, amount);
            const route = new JOE.Route([pair], WBTC);
            const trade = new JOE.Trade(
                route,
                new JOE.TokenAmount(WBTC, wbtcAmount),
                JOE.TradeType.EXACT_INPUT,
                JOE.ChainId.AVALANCHE
            );
            const price = trade.outputAmount.toExact();
            return parseEther(price);
        } else {
            const route = new JOE.Route([pair], JOE.WAVAX[JOE.ChainId.AVALANCHE]);
            const trade = new JOE.Trade(
                route,
                new JOE.TokenAmount(JOE.WAVAX[JOE.ChainId.AVALANCHE], amount),
                JOE.TradeType.EXACT_INPUT,
                JOE.ChainId.AVALANCHE
            )
        }
    }

    async getWbtcQuote(direction, amount) {
        const path = this.chain.name === "ETHEREUM" ? [0, 1] : [1, 0];
        return await this.renCrv[
            ["AVALANCHE", "MATIC"].includes(this.chain.name)
                ? "get_dy_underlying"
                : "get_dy"
        ](...(direction ? path : [...path].reverse()), amount);
    };
}