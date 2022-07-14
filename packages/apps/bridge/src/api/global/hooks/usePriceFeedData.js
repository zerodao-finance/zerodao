import { storeContext } from "../global";
import { useContext, useEffect } from "react";
import { ChainId, Token, WETH, Fetcher, Route } from "@uniswap/sdk";
import * as JOE from "@traderjoe-xyz/sdk";
import fixtures from "zero-protocol/lib/fixtures";
import { ethers } from "ethers";
const Quotes = require("zero-protocol/lib/quotes");

export const usePriceFeedContracts = () => {
  const { dispatch } = useContext(storeContext);

  const provider = new ethers.providers.InfuraProvider(
    "mainnet",
    "816df2901a454b18b7df259e61f92cd2"
  );
  const WBTC = new Token(
    ChainId.MAINNET,
    "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    8
  );
  const USDC = new Token(
    ChainId.MAINNET,
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    6
  );

  const getUniswapBtcUsdPrice = async () => {
    const pair = await Fetcher.fetchPairData(WBTC, USDC, provider);
    const route = new Route([pair], USDC);

    const usdcForOneBTC = route.midPrice.invert().toSignificant(7);
    return ethers.utils.parseUnits(usdcForOneBTC, 6).toString();
  };

  const getUniswapBtcETHPrice = async () => {
    const pair = await Fetcher.fetchPairData(
      WBTC,
      WETH[WBTC.chainId],
      provider
    );
    const route = new Route([pair], WETH[WBTC.chainId]);

    const ethForOneBTC = route.midPrice.invert().toSignificant(18);
    return ethers.utils.parseEther(ethForOneBTC).toString();
  };

  const getUniswapUsdcETHPrice = async () => {
    const pair = await Fetcher.fetchPairData(
      USDC,
      WETH[USDC.chainId],
      provider
    );
    const route = new Route([pair], WETH[USDC.chainId]);

    const usdcForOneETH = route.midPrice.toSignificant(7);
    return ethers.utils.parseUnits(usdcForOneETH, 6).toString();
  };

  const getTraderJoeUsdcAvaxPrice = async () => {
    const avalancheProvider = new ethers.providers.JsonRpcProvider(
      "https://api.avax.network/ext/bc/C/rpc"
    );

    const avUSDC = new JOE.Token(
      JOE.ChainId.AVALANCHE,
      fixtures.AVALANCHE.USDC,
      6
    );

    const pair = await JOE.Fetcher.fetchPairData(
      avUSDC,
      JOE.WAVAX[JOE.ChainId.AVALANCHE],
      avalancheProvider
    );

    const route = new JOE.Route([pair], JOE.WAVAX[avUSDC.chainId]);

    const usdcForOneAVAX = route.midPrice.toSignificant(7);
    return ethers.utils.parseUnits(usdcForOneAVAX, 6).toString();
  };

  const getUniswapUSDCMATICPrice = async () => {
    const quotes = Quotes("137");
    const quote = await quotes.wNativeToUSDC(ethers.utils.parseEther("1"));

    return quote.toString();
  };

  useEffect(() => {
    const fetchAllPricing = () => {
      Promise.allSettled([
        getUniswapBtcETHPrice(),
        getUniswapBtcUsdPrice(),
        getUniswapUsdcETHPrice(),
        getTraderJoeUsdcAvaxPrice(),
        getUniswapUSDCMATICPrice(),
      ]).then(async (result) => {
        dispatch({
          type: "UPDATE",
          module: "priceFeeds",
          effect: "data",
          data: {
            btc_usd: result[1].value,
            eth_usd: result[2].value,
            btc_eth: result[0].value,
            avax_usd: result[3].value,
            matic_usd: result[4].value,
          },
        });
      });
    };

    fetchAllPricing();
    var timerId;
    timerId = setInterval(() => {
      fetchAllPricing();
    }, 300000);

    return () => {
      clearInterval(timerId);
    };
  }, []);
};
