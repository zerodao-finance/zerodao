import { useContext, createContext, useReducer } from "react";
import { TransactionReducer } from "./reducer";
import { usePersistanceRefresh } from "./refresh";

/**
 * Transaction Logic
 * Handler Transfer and Burn request submitting,
 * Handle Transfer Request Persistance
 * Handle Transfer Request Refresh
 */

export const TransactionContext = createContext();

/**
 * initial state should be derived from indexedDB
 */
const initialState = {
  pending: {
    burn: [],
    transfer: [],
  },
  completed: {
    burn: [],
    transfer: [],
  },
};

export const { Provider, Consumer } = TransactionContext;

export const TransactionProvider = ({ children }) => {
  const [transactions, txDispatch] = useReducer(
    TransactionReducer,
    initialState
  );

  const providerValue = { transactions, txDispatch };
  usePersistanceRefresh(txDispatch);

  return <Provider value={providerValue}>{children}</Provider>;
};

export const useTransactionContext = () => {
  const { transactions, txDispatch } = useContext(TransactionContext);

  return { ...transactions, txDispatch };
};
