import { storeContext } from "../global";
import { useContext } from "react";

export const useHistory = () => {
  const { state, dispatch } = useContext(storeContext);

  const getHistoryProps = ({ ...otherProps } = {}) => ({});

  const getManageTransactionProps = ({ ...otherProps } = {}) => ({});
};
