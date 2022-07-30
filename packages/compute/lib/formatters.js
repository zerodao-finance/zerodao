"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatUSDC = exports.formatUSDCPricedETH = exports.formatUSDCPricedBTC = void 0;
const ethers_1 = require("ethers");
const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});
/**
 * @param  {string} btc_amount
 * @param  {BigNumber} btc_usd
 * @returns {string} formatted and representing the value in USD
 * @description parse the amount as btc, multiply it by usdc price,
 * format it down to 14 units. 14 units bc 6 from USDC and 8 from
 * BTC that get added together
 */
const formatUSDCPricedBTC = (btc_amount, btc_usd) => {
    btc_amount = ethers_1.ethers.utils.parseUnits(btc_amount || "0", 8);
    const pricedBTC = btc_amount.mul(btc_usd || "0");
    return formatter.format(ethers_1.ethers.utils.formatUnits(pricedBTC, 14));
};
exports.formatUSDCPricedBTC = formatUSDCPricedBTC;
/**
 * @param  {string} eth_amount
 * @param  {BigNumber} eth_usd
 * @returns {string} formatted and representing the value in USD
 * @description parse the amount as eth, multiply it by usdc price,
 * format it down to 24 units. 24 units bc 6 from USDC and 18 from
 * ETH that get added together
 */
const formatUSDCPricedETH = (eth_amount, eth_usd) => {
    eth_amount = ethers_1.ethers.utils.parseEther(eth_amount || "0");
    const pricedETH = eth_amount.mul(eth_usd || "0");
    return formatter.format(ethers_1.ethers.utils.formatUnits(pricedETH, 24));
};
exports.formatUSDCPricedETH = formatUSDCPricedETH;
const formatUSDC = (usdc_amount) => {
    return formatter.format(usdc_amount || "0");
};
exports.formatUSDC = formatUSDC;
//# sourceMappingURL=formatters.js.map