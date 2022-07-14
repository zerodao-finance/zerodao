import * as React from "react";
import * as ReactDOM from "react-dom";
import { NotificationReducer } from "./reducer";
import { NotificationContainer } from "../../ui/layouts/layout.notification";
import { useTimeout } from "./timeout";
import { useConfirmations } from "./confirmation";

const NotificationContext = React.createContext();

const initialState = [];

export const { Provider, Consumer } = NotificationContext;

export const NotificationProvider = ({ children }) => {
  const [card, cardDispatch] = React.useReducer(
    NotificationReducer,
    initialState
  );
  const toastData = { card, cardDispatch };
  useTimeout(card);
  useConfirmations(card);
  return (
    <Provider value={toastData}>
      {children}
      {ReactDOM.createPortal(
        <NotificationContainer card={card} />,
        document.body
      )}
    </Provider>
  );
};

export const useNotificationContext = () => {
  return React.useContext(NotificationContext);
};
