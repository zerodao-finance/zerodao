import { storeContext } from "../global";
import { useContext } from "react";
import { useSDKTransactionSubmit } from "../../hooks/submit";
import { useBridgeInput } from "./interface.bridge.transfer";

export const useBridgeBurnInput = () => {
  const { state, dispatch } = useContext(storeContext);
  const { eth_usd, btc_usd, avax_usd, matic_usd } = state.priceFeeds.data;
  const { wallet } = state;
  const { sendBurnRequest } = useSDKTransactionSubmit("burn");
  const { input } = state.burn;
  const { amount, destination, token, quote } = input;
  const { setTransferSlippage } = useBridgeInput();

  const updateAmount = (e) => {
    dispatch({
      type: "UPDATE",
      module: "burn",
      effect: "input",
      data: { amount: e.target.value },
    });
  };

  const setAmount = (e) => {
    dispatch({
      type: "UPDATE",
      module: "burn",
      effect: "input",
      data: { amount: e },
    });
  };

  const updateDestination = (e) => {
    dispatch({
      type: "UPDATE",
      module: "burn",
      effect: "input",
      data: { destination: e.target.value },
    });
  };

  const setToken = (e) => {
    dispatch({
      type: "UPDATE",
      module: "burn",
      effect: "input",
      data: { token: e },
    });
  };

  const setQuote = (e) => {
    dispatch({
      type: "UPDATE",
      module: "burn",
      effect: "input",
      data: { quote: e },
    });
  };

  const getBurnSlippageProps = ({ ...otherProps } = {}) => ({
    amount: amount,
    token,
    slippage: state.transfer.input.slippage,
    setSlippage: setTransferSlippage,
  });

  const getBridgeBurnInputProps = ({ ...otherProps } = {}) => ({
    amount: amount,
    destination: destination,
    setToken,
    token,
    btc_usd,
    eth_usd,
    avax_usd,
    matic_usd,
    setAmount,
    updateAmount,
    updateDestination,
    chainId: wallet.chainId,
    quote,
    setQuote,
  });

  const getBurnSenderProps = ({ ...otherProps } = {}) => ({
    action: sendBurnRequest,
    destination: destination,
    token,
    amount: amount,
    btc_usd: btc_usd,
    chainId: wallet.chainId,
    quote,
  });

  return {
    getBridgeBurnInputProps,
    getBurnSlippageProps,
    getBurnSenderProps,
  };
};
