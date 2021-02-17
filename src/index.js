import React from "react";
import ReactDOM from "react-dom";
import AuthContextProvider from "../src/context/auth-context";
import "./index.css";
import App from "./App";

ReactDOM.render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>,
  document.getElementById("root")
);
