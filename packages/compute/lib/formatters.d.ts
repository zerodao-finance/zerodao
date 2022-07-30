/**
 * @param  {string} btc_amount
 * @param  {BigNumber} btc_usd
 * @returns {string} formatted and representing the value in USD
 * @description parse the amount as btc, multiply it by usdc price,
 * format it down to 14 units. 14 units bc 6 from USDC and 8 from
 * BTC that get added together
 */
export declare const formatUSDCPricedBTC: (btc_amount: any, btc_usd: any) => string;
/**
 * @param  {string} eth_amount
 * @param  {BigNumber} eth_usd
 * @returns {string} formatted and representing the value in USD
 * @description parse the amount as eth, multiply it by usdc price,
 * format it down to 24 units. 24 units bc 6 from USDC and 18 from
 * ETH that get added together
 */
export declare const formatUSDCPricedETH: (eth_amount: any, eth_usd: any) => string;
export declare const formatUSDC: (usdc_amount: any) => string;
