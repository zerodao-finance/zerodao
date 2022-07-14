import { storeContext } from "../global";
import { useContext, useEffect } from "react";

export const useBridgePage = () => {
  const { state, dispatch } = useContext(storeContext);
  const { mode } = state.bridge;
  const { wallet } = state;
  const { tcSigned } = state.termsAndConditions;

  // Initialize the bridge page
  useEffect(async () => {
    const isSigned = localStorage.getItem("TC_agreement_signed");
    if (isSigned == "true") {
      dispatch({ type: "UPDATE_TC", data: { tcSigned: true } });
    }
  }, []);

  const toggleMode = (newMode) => {
    dispatch({
      type: "UPDATE",
      module: "bridge",
      effect: "mode",
      data: { mode: newMode },
    });
  };

  const setChainId = (newChainId) => {
    dispatch({
      type: "UPDATE_WALLET",
      effect: "wallet",
      data: {
        chainId: newChainId,
        isLoading: true,
      },
    });
  };

  const getBridgePageProps = ({ ...otherProps } = {}) => ({
    mode: mode.mode,
    toggleMode: toggleMode,
    tcSigned: tcSigned,
  });

  const getBridgeChainProps = ({ ...otherProps } = {}) => ({
    chainId: wallet.chainId,
    setChainId,
  });

  return {
    getBridgePageProps,
    getBridgeChainProps,
    setChainId,
  };
};
