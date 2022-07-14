import { storeContext } from "../global";
import { useEffect, useContext } from "react";

export const useActiveModuleSwitcher = () => {
  const { state, dispatch } = useContext(storeContext);
  const { module } = state;
  const { isLoading } = module;
  const changeActiveModule = (module) => {
    dispatch({
      type: "SUCCEED_REQUEST",
      effect: "module",
      payload: { effect: "currentModule", data: module },
    });
  };

  const resetModule = () => {
    dispatch({ type: "START_REQUEST", effect: "module" });
  };

  useEffect(() => {
    if (isLoading) {
      dispatch({
        type: "SUCCEED_REQUEST",
        effect: "module",
        payload: { effect: "currentModule", data: "bridge" },
      });
    }
  }, [isLoading]);

  var currentModule = module.currentModule;
  return {
    changeActiveModule,
    resetModule,
    currentModule,
    isLoading,
  };
};
