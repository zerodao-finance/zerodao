"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quoter = exports.makeQuoter = void 0;
const contracts_1 = require("@ethersproject/contracts");
const units_1 = require("@ethersproject/units");
const constants_1 = require("@zerodao/constants");
const sdk_1 = __importDefault(require("@traderjoe-xyz/sdk"));
const getChainData = (chain) => { return; };
function makeQuoter(CHAIN = "1", provider) {
    let chain; // = function that returns chain details
    /**
     * name: string = "ETHEREUM"
     * chianId: string = "1"
     * provider: providerv = provider("mainnet")
     * uniswapName: string = "MAINNET"
     */
}
exports.makeQuoter = makeQuoter;
class Quoter {
    constructor(chain, provider) {
        this.chain = chain;
        this.provider = provider;
        this.quoter = new contracts_1.Contract("0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6", [
            "function quoteExactInputSingle(address tokenIn, address tokenOut, uint24 fee, uint256 amountIn, uint160 sqrtPriceLimitX96) public view returns (uint256 amountOut)",
            "function quoteExactInput(bytes path, uint256 amountIn) public view returns (uint256 amountOut)",
        ], provider);
        this.renCrv = new contracts_1.Contract("0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6", [
            "function quoteExactInputSingle(address tokenIn, address tokenOut, uint24 fee, uint256 amountIn, uint160 sqrtPriceLimitX96) public view returns (uint256 amountOut)",
            "function quoteExactInput(bytes path, uint256 amountIn) public view returns (uint256 amountOut)",
        ], provider);
    }
    static makeQuoter(chain = "1", provider) {
        let _chain = getChainData(chain);
        return new Quoter(_chain, provider);
    }
    async getAVAXQuote(direction, amount) {
        const WBTC = new sdk_1.default.Token(sdk_1.default.ChainId.AVALANCHE, constants_1.FIXTURES.AVALANCHE.WBTC, 8);
        const pair = await sdk_1.default.Fetcher.fetchPairData(WBTC, sdk_1.default.WAVAX[sdk_1.default.ChainId.AVALANCHE], this.provider);
        if (direction) {
            const wbtcAmount = await this.getWbtcQuote(true, amount);
            const route = new sdk_1.default.Route([pair], WBTC);
            const trade = new sdk_1.default.Trade(route, new sdk_1.default.TokenAmount(WBTC, wbtcAmount), sdk_1.default.TradeType.EXACT_INPUT, sdk_1.default.ChainId.AVALANCHE);
            const price = trade.outputAmount.toExact();
            return (0, units_1.parseEther)(price);
        }
        else {
            const route = new sdk_1.default.Route([pair], sdk_1.default.WAVAX[sdk_1.default.ChainId.AVALANCHE]);
            const trade = new sdk_1.default.Trade(route, new sdk_1.default.TokenAmount(sdk_1.default.WAVAX[sdk_1.default.ChainId.AVALANCHE], amount), sdk_1.default.TradeType.EXACT_INPUT, sdk_1.default.ChainId.AVALANCHE);
        }
    }
    async getUsdcquoteAVAX(direction, amount) {
        const aTricrypto = new contracts_1.Contract("0xB755B949C126C04e0348DD881a5cF55d424742B2", ["function get_dy(uint256, uint256, uint256) view returns (uint256)"], this.provider);
        const crvUSD = new contracts_1.Contract("0x7f90122BF0700F9E7e1F688fe926940E8839F353", [
            "function calc_token_amount(uint256[3] calldata, bool) view returns (uint256)",
            "function calc_withdraw_one_coin(uint256, int128) view returns (uint256)",
        ], this.provider);
        const renCrvPath = [0, 1];
        const path = [0, 1];
        if (direction) {
            const av3usdAmount = await crvUSD.calc_token_amount([0, amount, 0], true);
            const wbtcAmount = await aTricrypto.get_dy(...path, av3usdAmount);
            return await this.renCrv.get_dy(...renCrvPath, wbtcAmount);
        }
        else {
            const wbtcAmount = await this.renCrv.get_dy(...[...renCrvPath].reverse(), amount);
            const av3usdAmount = await aTricrypto.get_dy(...[...path].reverse(), wbtcAmount);
            return await crvUSD.calc_withdraw_one_coin(av3usdAmount, 1);
        }
    }
    async getWbtcQuote(direction, amount) {
        const path = this.chain.name === "ETHEREUM" ? [0, 1] : [1, 0];
        return await this.renCrv[["AVALANCHE", "MATIC"].includes(this.chain.name)
            ? "get_dy_underlying"
            : "get_dy"](...(direction ? path : [...path].reverse()), amount);
    }
    ;
}
exports.Quoter = Quoter;
//# sourceMappingURL=quotes.js.map