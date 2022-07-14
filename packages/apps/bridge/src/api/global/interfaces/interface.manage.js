import { storeContext } from "../global";
import { useContext, useEffect } from "react";

export const useTransactions = () => {
  const { state, dispatch } = useContext(storeContext);
  const { requests } = state;
  const { transfer, burn } = requests;

  useEffect(() => {}, [requests]);

  return {
    transfer,
  };
};
