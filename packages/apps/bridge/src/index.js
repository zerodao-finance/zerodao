import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import "./app.css";
import "react-toastify/dist/ReactToastify.min.css";
import { StateProvider } from "./api/global";
import { TransactionProvider } from "./api/transaction";
import { NotificationProvider } from "./api/notification/index";
import { DashboardPage } from "./ui/pages/dashboard";
import { Buffer } from "buffer";
window.Buffer = Buffer;

Object.keys(process.env).forEach((key) => {
  const match = key.match(/REACT_APP_(.*$)/);
  if (match) {
    process.env[match[1]] = process.env[key];
  }
});

ReactDOM.render(
  <React.StrictMode className="">
    <NotificationProvider>
      <TransactionProvider>
        <StateProvider>
          <HashRouter>
            <DashboardPage />
          </HashRouter>
        </StateProvider>
      </TransactionProvider>
    </NotificationProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
