import { storeContext } from "../global";
import { useContext, useEffect } from "react";
import { GlobalStateHelper } from "../../utils/global.utilities";
export const useModuleState = (module) => {
  const { state, dispatch } = useContext(storeContext);
  const StateHelper = new GlobalStateHelper(state, dispatch);
  const { mode } = state[module];

  useEffect(() => {
    const { processing, signed, gatewayRecieved } =
      StateHelper.getModuleModeState(module);
    if (processing) {
      StateHelper.update("transfer", "mode", { status: "isSigning" });
    } else if (signed && !gatewayRecieved) {
      StateHelper.update("transfer", "mode", { status: "isProcessing" });
    } else if (gatewayRecieved) {
      StateHelper.update("transfer", "mode", { status: "showGateway" });
    }
  }, [mode]);
};
