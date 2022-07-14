import { storeContext } from "../global";
import { useContext } from "react";

export const useBridgePage = () => {
  const { state, dispatch } = useContext(storeContext);
  const { mode } = state.bridge;

  const toggleMode = (newMode) => {
    dispatch({
      type: "UPDATE",
      module: "bridge",
      effect: "mode",
      data: { mode: newMode },
    });
  };

  // reset mode and return to 'transfer' | 'release'
  const back = () => {
    dispatch({
      type: "UPDATE",
      module: "bridge",
      effect: "mode",
      data: { processing: false },
    });
  };

  return {
    ...mode,
    back,
    toggleMode,
  };
};
