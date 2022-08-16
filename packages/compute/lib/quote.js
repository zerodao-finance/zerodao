"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCompute = exports.makeQuoter = exports.applyRatio = exports.keeperReward = void 0;
const units_1 = require("@ethersproject/units");
const solidity_1 = require("@ethersproject/solidity");
const contracts_1 = require("@ethersproject/contracts");
const common_1 = require("@zerodao/common");
const ren_1 = require("@renproject/ren");
const bignumber_1 = require("@ethersproject/bignumber");
const constants_1 = __importDefault(require("@ethersproject/constants"));
const chains_1 = require("@renproject/chains");
const sdk_1 = __importDefault(require("@traderjoe-xyz/sdk"));
const sdk_2 = __importStar(require("@uniswap/sdk"));
const chains_2 = require("@zerodao/chains");
exports.keeperReward = (0, units_1.parseEther)("0.001");
const getProvider = (chainName) => {
    return (0, chains_2.providerFromChainId)(chains_2.NAME_CHAIN[chainName].id);
};
function applyRatio(amount, ratio) {
    return bignumber_1.BigNumber.from(amount)
        .mul(ratio)
        .div((0, units_1.parseEther)("1"));
}
exports.applyRatio = applyRatio;
;
function returnChainDetails(CHAINID, _provider) {
    const provider = _provider || (0, chains_2.providerFromChainId)(CHAINID);
    const chain = chains_2.CHAINS[CHAINID];
    return {
        provider,
        name: chain.name.toUpperCase(),
        uniswapName: chain.uniswapName,
        chainId: Number(CHAINID)
    };
}
function makeQuoter(CHAIN = "1", provider) {
    const chain = returnChainDetails(CHAIN, provider);
    const renCrv = new contracts_1.Contract(common_1.FIXTURES[chain.name]["Curve_Ren"], [
        "function get_dy(int128, int128, uint256) view returns (uint256)",
        "function get_dy_underlying(int128, int128, uint256) view returns (uint256)",
    ], chain.provider);
    const quoter = new contracts_1.Contract("0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6", [
        "function quoteExactInputSingle(address tokenIn, address tokenOut, uint24 fee, uint256 amountIn, uint160 sqrtPriceLimitX96) public view returns (uint256 amountOut)",
        "function quoteExactInput(bytes path, uint256 amountIn) public view returns (uint256 amountOut)",
    ], chain.provider);
    //direction ? renzec -> eth : eth -> renzec
    const getRenZECETHQuote = async (direction, amount) => {
        const RENZEC = new sdk_2.default.Token(sdk_2.default.ChainId.MAINNET, common_1.FIXTURES.ETHEREUM.renZEC, 8);
        const weth = sdk_2.default.WETH[sdk_2.default.ChainId.MAINNET];
        const pair = await sdk_2.default.Fetcher.fetchPairData(RENZEC, weth, chain.provider);
        if (direction) {
            const route = new sdk_2.default.Route([pair], RENZEC);
            const trade = new sdk_2.default.Trade(route, new sdk_2.default.TokenAmount(RENZEC, amount), sdk_2.default.TradeType.EXACT_INPUT);
            const price = trade.outputAmount.toExact();
            return (0, units_1.parseEther)(price);
        }
        else {
            const route = new sdk_2.default.Route([pair], weth);
            const trade = new sdk_2.default.Trade(route, new sdk_2.default.TokenAmount(weth, amount.toString()), sdk_2.default.TradeType.EXACT_INPUT);
            const price = trade.outputAmount.toExact();
            return (0, units_1.parseUnits)(price, 8);
        }
    };
    // direction ? renbtc -> avax : avax -> renbtc
    const getAVAXQuote = async (direction, amount) => {
        const WBTC = new sdk_1.default.Token(sdk_1.default.ChainId.AVALANCHE, common_1.FIXTURES.AVALANCHE.WBTC, 8);
        const pair = await sdk_1.default.Fetcher.fetchPairData(WBTC, sdk_1.default.WAVAX[sdk_1.default.ChainId.AVALANCHE], chain.provider);
        if (direction) {
            const wbtcAmount = await getWbtcQuote(true, amount);
            const route = new sdk_1.default.Route([pair], WBTC);
            const trade = new sdk_1.default.Trade(route, new sdk_1.default.TokenAmount(WBTC, wbtcAmount), sdk_1.default.TradeType.EXACT_INPUT, chain.chainId);
            const price = trade.outputAmount.toExact();
            return (0, units_1.parseEther)(price);
        }
        else {
            const route = new sdk_1.default.Route([pair], sdk_1.default.WAVAX[sdk_1.default.ChainId.AVALANCHE]);
            const trade = new sdk_1.default.Trade(route, new sdk_1.default.TokenAmount(sdk_1.default.WAVAX[sdk_1.default.ChainId.AVALANCHE], amount), sdk_1.default.TradeType.EXACT_INPUT, chain.chainId);
            return await getWbtcQuote(false, (0, units_1.parseUnits)(trade.outputAmount.toExact(), 8));
        }
    };
    // direction = true ? usdc -> renbtc
    const getUsdcQuoteAVAX = async (direction, amount) => {
        //amount = renBTC amount
        const aTricrypto = new contracts_1.Contract("0xB755B949C126C04e0348DD881a5cF55d424742B2", ["function get_dy(uint256, uint256, uint256) view returns (uint256)"], chain.provider);
        const crvUSD = new contracts_1.Contract("0x7f90122BF0700F9E7e1F688fe926940E8839F353", [
            "function calc_token_amount(uint256[3] calldata, bool) view returns (uint256)",
            "function calc_withdraw_one_coin(uint256, int128) view returns (uint256)",
        ], chain.provider);
        //0 = wbtc, 1 = renbtc
        const renCrvPath = [0, 1];
        //0 = av3usd, 1 = wbtc
        const path = [0, 1];
        if (direction) {
            const av3usdAmount = await crvUSD.calc_token_amount([0, amount, 0], true);
            const wbtcAmount = await aTricrypto.get_dy(...path, av3usdAmount);
            return await renCrv.get_dy(...renCrvPath, wbtcAmount);
        }
        else {
            const wbtcAmount = await renCrv.get_dy(...[...renCrvPath].reverse(), amount);
            const av3usdAmount = await aTricrypto.get_dy(...[...path].reverse(), wbtcAmount);
            return await crvUSD.calc_withdraw_one_coin(av3usdAmount, 1);
        }
    };
    const getRenBTCForOneETHPrice = async () => {
        if (chain.name === "AVALANCHE") {
            return await getAVAXQuote(false, (0, units_1.parseEther)("1"));
        }
        else if (chain.name === "ETHEREUM") {
            const renBTC = new sdk_2.default.Token(sdk_2.default.ChainId.MAINNET, common_1.FIXTURES.ETHEREUM.renBTC, 8);
            const pair = await sdk_2.default.Fetcher.fetchPairData(renBTC, sdk_2.default.WETH[renBTC.chainId], chain.provider);
            const route = new sdk_2.Route([pair], sdk_2.default.WETH[renBTC.chainId]);
            const renBTCForOneEth = route.midPrice.toSignificant(7);
            return (0, units_1.parseUnits)(renBTCForOneEth, 8);
        }
        else if (chain.name === "OPTIMISM") {
            return (0, units_1.parseUnits)("0", 8);
        }
        else {
            return await ETHtoRenBTC((0, units_1.parseEther)("1"));
        }
    };
    const fromUSDC = async (amount) => {
        if (chain.name === "AVALANCHE") {
            return await getUsdcQuoteAVAX(true, amount);
        }
        else {
            let output = null;
            try {
                output = await quoter.quoteExactInput((0, solidity_1.pack)(["address", "uint24", "address", "uint24", "address"], [
                    common_1.FIXTURES[chain.name].USDC,
                    500,
                    common_1.FIXTURES[chain.name].wETH,
                    500,
                    common_1.FIXTURES[chain.name].WBTC,
                ]), amount);
            }
            catch (e) {
                console.error(e);
                console.error("Insufficient USDC amount for price fetch");
                return 0;
            }
            const result = await getWbtcQuote(false, output);
            return result;
        }
    };
    const toUSDC = async (amount) => {
        try {
            if (chain.name === "AVALANCHE") {
                return await getUsdcQuoteAVAX(false, amount);
            }
            else {
                const wbtcOut = await getWbtcQuote(true, amount);
                return await quoter.quoteExactInput((0, solidity_1.pack)(["address", "uint24", "address", "uint24", "address"], [
                    common_1.FIXTURES[chain.name].WBTC,
                    500,
                    common_1.FIXTURES[chain.name].wETH,
                    500,
                    common_1.FIXTURES[chain.name].USDC,
                ]), wbtcOut);
            }
        }
        catch (e) {
            console.error(e);
            return 0;
        }
    };
    // direction = true ? renbtc -> wbtc
    const getWbtcQuote = async (direction, amount) => {
        const path = chain.name === "ETHEREUM" ? [0, 1] : [1, 0];
        return await renCrv[["AVALANCHE", "MATIC"].includes(chain.name)
            ? "get_dy_underlying"
            : "get_dy"](...(direction ? path : [...path].reverse()), amount);
    };
    const ETHtoRenBTC = async (amount) => {
        if (chain.name === "AVALANCHE") {
            return await getAVAXQuote(false, amount);
        }
        else {
            const path = [
                common_1.FIXTURES[chain.name].wNative,
                500,
                common_1.FIXTURES[chain.name].wETH,
                500,
                common_1.FIXTURES[chain.name].WBTC,
            ];
            path.splice(2, chain.name !== "MATIC" ? 2 : 0);
            const output = await quoter.quoteExactInput((0, solidity_1.pack)(["address", "uint24", "address"].concat(chain.name === "MATIC" ? ["uint24", "address"] : []), path), amount);
            const result = await getWbtcQuote(false, output);
            return result;
        }
    };
    // only for matic
    const wNativeToUSDC = async (amount) => {
        return await quoter.quoteExactInput((0, solidity_1.pack)(["address", "uint24", "address"], [common_1.FIXTURES[chain.name].wNative, 500, common_1.FIXTURES[chain.name].USDC]), amount);
    };
    const ETHToRenZEC = async (amount) => {
        return await getRenZECETHQuote(false, amount);
    };
    const renZECToETH = async (amount) => {
        return await getRenZECETHQuote(true, amount);
    };
    const renBTCToETH = async (amount) => {
        if (chain.name === "AVALANCHE") {
            return await getAVAXQuote(true, amount);
        }
        else {
            const path = [
                common_1.FIXTURES[chain.name].WBTC,
                500,
                common_1.FIXTURES[chain.name].wETH,
                500,
                common_1.FIXTURES[chain.name].wNative,
            ];
            path.splice(2, chain.name !== "MATIC" ? 2 : 0);
            const wbtcOut = await getWbtcQuote(true, amount);
            const quote = await quoter.quoteExactInput((0, solidity_1.pack)(["address", "uint24", "address"].concat(chain.name === "MATIC" ? ["uint24", "address"] : []), path), wbtcOut);
            return quote;
        }
    };
    return {
        fromUSDC,
        getAVAXQuote,
        getRenBTCForOneETHPrice,
        getUsdcQuoteAVAX,
        wNativeToUSDC,
        getWbtcQuote,
        renBTCToETH,
        ETHToRenZEC,
        renZECToETH,
        toUSDC,
        ETHtoRenBTC,
        chain,
    };
}
exports.makeQuoter = makeQuoter;
;
function makeCompute(CHAIN = "1") {
    const quotes = makeQuoter(CHAIN);
    const GAS_COST = bignumber_1.BigNumber.from((() => {
        switch (CHAIN) {
            case "42161":
                return "480000";
            case "137":
                return "642000";
            case "43114":
                return "1240000";
            default:
                return "420000";
        }
    })());
    const bitcoin = new chains_1.Bitcoin({ network: "mainnet" });
    const zcash = new chains_1.Zcash({ network: "mainnet" });
    const arbitrum = new chains_1.Arbitrum({
        provider: getProvider("Arbitrum"),
        network: "mainnet",
    });
    const avalanche = new chains_1.Avalanche({
        provider: getProvider("Avalanche"),
        network: "mainnet",
    });
    const polygon = new chains_1.Polygon({
        provider: getProvider("Polygon"),
        network: "mainnet",
    });
    const optimism = new chains_1.Optimism({
        provider: getProvider("Optimism"),
        network: "mainnet",
    });
    const ethereum = new chains_1.Ethereum({
        provider: getProvider("Ethereum"),
        network: "mainnet",
    });
    const renJS = new ren_1.RenJS("mainnet").withChains(bitcoin, zcash, arbitrum, avalanche, polygon, optimism, ethereum);
    const computeTransferOutput = async ({ module, amount, primaryToken }) => {
        if (primaryToken == "ZEC") {
            switch (module) {
                case common_1.FIXTURES["ETHEREUM"].renZEC:
                    return await deductMintFee(amount, primaryToken);
                case common_1.FIXTURES["ETHEREUM"].ETH:
                    return await quotes.renZECToETH(await deductMintFee(amount, primaryToken));
                default:
                    console.error("no asset found for getConvertedAmount:" + module);
                    return bignumber_1.BigNumber.from("0");
            }
        }
        switch (module) {
            case common_1.FIXTURES[quotes.chain.name].USDC:
                return await quotes.toUSDC(await deductMintFee(amount, primaryToken));
            case common_1.FIXTURES[quotes.chain.name].WBTC:
                return await deductMintFee(await quotes.getWbtcQuote(true, amount), 1);
            case common_1.FIXTURES[quotes.chain.name].renBTC:
                return await deductMintFee(amount, primaryToken);
            case constants_1.default.AddressZero:
                return await quotes.renBTCToETH(await deductMintFee(amount, primaryToken));
            default:
                return bignumber_1.BigNumber.from("0");
        }
    };
    const computeGasFee = (gasCost, gasPrice, primaryToken) => {
        switch (primaryToken) {
            case "ZEC":
                return computeRenZECGasFee(gasCost, gasPrice);
            default:
                return computeRenBTCGasFee(gasCost, gasPrice);
        }
    };
    const computeRenBTCGasFee = async (gasCost, gasPrice) => {
        return gasCost
            .mul(gasPrice)
            .mul(await quotes.getRenBTCForOneETHPrice())
            .div((0, units_1.parseEther)("1"));
    };
    const computeRenZECGasFee = async (gasCost, gasPrice) => {
        return gasCost
            .mul(gasPrice)
            .mul(await quotes.ETHToRenZEC((0, units_1.parseEther)("1")))
            .div((0, units_1.parseEther)("1"));
    };
    const deductBurnFee = async (amount, primaryToken) => {
        amount = bignumber_1.BigNumber.from(amount);
        const feeAmounts = await applyFee(amount, burnFee, renVmFeeBurn, primaryToken);
        const amountAfterDeduction = amount.sub(feeAmounts.totalFees);
        return amountAfterDeduction <= 0 ? 0 : amountAfterDeduction;
    };
    const deductMintFee = async (amount, primaryToken) => {
        amount = bignumber_1.BigNumber.from(amount);
        const feeAmounts = await applyFee(amount, mintFee, renVmFeeMint, primaryToken);
        const amountAfterDeduction = amount.sub(feeAmounts.totalFees);
        return amountAfterDeduction <= 0 ? 0 : amountAfterDeduction;
    };
    const getConvertedAmount = (exports.getConvertedAmount = async (asset, amount, primaryToken) => {
        if (primaryToken == "ZEC") {
            switch (asset) {
                case common_1.FIXTURES["ETHEREUM"].renZEC:
                    return amount;
                case common_1.FIXTURES["ETHEREUM"].ETH:
                    return await quotes.ETHToRenZEC(amount);
                default:
                    console.error("no asset found for getConvertedAmount:" + asset);
                    return amount;
            }
        }
        switch (asset) {
            case common_1.FIXTURES[quotes.chain.name].WBTC:
                return await quotes.getWbtcQuote(false, amount);
            case common_1.FIXTURES[quotes.chain.name].renBTC:
                return amount;
            case common_1.FIXTURES[quotes.chain.name].USDC:
                return await quotes.fromUSDC(amount);
            case constants_1.default.AddressZero:
                return await quotes.ETHtoRenBTC(amount);
            default:
                console.error("no asset found for getConvertedAmount:" + asset);
                return amount;
        }
    });
    const computeOutputBTC = async (burnRequest) => {
        const { asset, amount, primaryToken } = burnRequest;
        const convertedAmount = await getConvertedAmount(asset, amount, primaryToken);
        return await deductBurnFee(convertedAmount, primaryToken);
    };
    const selectNetwork = (primaryToken) => {
        switch (primaryToken) {
            case "ZEC":
                return { network: "Zcash", asset: "ZEC" };
            default:
                return { network: "Bitcoin", asset: "BTC" };
        }
    };
    const applyFee = async (amountIn, zeroFee, renVmFee, primaryToken) => {
        const gasPrice = await quotes.chain.provider.getGasPrice();
        const { network, asset } = selectNetwork(primaryToken);
        const gasFee = await computeGasFee(GAS_COST.add(exports.keeperReward.div(gasPrice)), gasPrice, primaryToken);
        const evmChain = (0, chains_2.getChainName)(CHAIN) == "Mainnet" ? "Ethereum" : (0, chains_2.getChainName)(CHAIN);
        let renOutput = (0, units_1.parseUnits)("0", 8);
        try {
            const renVmFees = await renJS.getFees({
                asset: asset,
                from: zeroFee == mintFee ? network : evmChain,
                to: zeroFee == burnFee ? network : evmChain,
            });
            renOutput = bignumber_1.BigNumber.from(renVmFees.estimateOutput(amountIn.toString()).toFixed());
        }
        catch (e) {
            console.error("error getting renVM fees", e);
            renOutput = amountIn.sub((0, units_1.parseUnits)("0.004", 8));
        }
        const zeroProtocolFeeAmt = applyRatio(amountIn, zeroFee);
        const renVmFeeAmt = applyRatio(amountIn, renVmFee);
        const renVmBtcNetworkFee = amountIn.sub(renOutput).sub(renVmFeeAmt);
        const opFee = zeroProtocolFeeAmt.add(renVmFeeAmt);
        var totalFees = gasFee.add(opFee);
        totalFees = totalFees.add(renVmBtcNetworkFee);
        return {
            gasFee,
            zeroProtocolFeeAmt,
            renVmFeeAmt,
            renVmBtcNetworkFee,
            opFee,
            totalFees,
        };
    };
    const burnFee = (0, units_1.parseEther)("0.003");
    const renVmFeeBurn = (0, units_1.parseEther)("0.001");
    const mintFee = (0, units_1.parseEther)("0.002");
    const renVmFeeMint = (0, units_1.parseEther)("0.002");
    return {
        computeTransferOutput,
        computeOutputBTC,
        applyFee,
        burnFee,
        mintFee,
        renVmFeeBurn,
        renVmFeeMint,
        computeRenBTCGasFee,
        getConvertedAmount,
    };
}
exports.makeCompute = makeCompute;
;
//# sourceMappingURL=quote.js.map