import { Contract } from "@ethersproject/contracts";
import { JsonRpcProvider } from "@ethersproject/providers";
import { parseEther } from "@ethersproject/units";
import { FIXTURES } from "@zerodao/constants";
import JOE from "@traderjoe-xyz/sdk";


type Chain = {
    name: string;
    uniswapName: string
    chainId: string;
    provider: JsonRpcProvider;
}

const getChainData = (chain: string): Chain => { return };



export function makeQuoter(CHAIN = "1", provider) {
    let chain; // = function that returns chain details
    /**
     * name: string = "ETHEREUM"
     * chianId: string = "1"
     * provider: providerv = provider("mainnet")
     * uniswapName: string = "MAINNET"
     */
}

export class Quoter {
    static makeQuoter(chain = "1", provider: JsonRpcProvider) {
        let _chain = getChainData(chain);
        return new Quoter(_chain, provider)
    }

    chain: Chain;
    provider: JsonRpcProvider;
    quoter: Contract
    renCrv: Contract
    constructor(chain: Chain, provider: JsonRpcProvider) {
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

    async getUsdcquoteAVAX(direction, amount) {
        const aTricrypto = new Contract(
            "0xB755B949C126C04e0348DD881a5cF55d424742B2",
            ["function get_dy(uint256, uint256, uint256) view returns (uint256)"],
            this.provider
        )

        const crvUSD = new Contract(
            "0x7f90122BF0700F9E7e1F688fe926940E8839F353",
            [
                "function calc_token_amount(uint256[3] calldata, bool) view returns (uint256)",
                "function calc_withdraw_one_coin(uint256, int128) view returns (uint256)",
            ],
            this.provider
        )

        const renCrvPath = [0, 1];

        const path = [0, 1];

        if (direction) {
            const av3usdAmount = await crvUSD.calc_token_amount([0, amount, 0], true);

            const wbtcAmount = await aTricrypto.get_dy(...path, av3usdAmount);
            return await this.renCrv.get_dy(...renCrvPath, wbtcAmount);
        } else {
            const wbtcAmount = await this.renCrv.get_dy(
                ...[...renCrvPath].reverse(),
                amount
            );
            const av3usdAmount = await aTricrypto.get_dy(
                ...[...path].reverse(),
                wbtcAmount
            );
            return await crvUSD.calc_withdraw_one_coin(av3usdAmount, 1);
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