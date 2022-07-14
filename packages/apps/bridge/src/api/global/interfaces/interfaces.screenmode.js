import { storeContext } from "../global";
import { useContext } from "react";
export function useScreenMode() {
  const { state, dispatch } = useContext(storeContext);
  const { utilities } = state;

  const toggleScreenMode = () => {
    var dark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("screenMode", dark ? "dark" : "light");
    dispatch({
      type: "SUCCEED_REQUEST",
      effect: "utilities",
      payload: { effect: "themeMode", data: dark ? "dark" : "light" },
    });
  };

  const themeMode = utilities.themeMode;

  return {
    themeMode,
    toggleScreenMode,
  };
}
