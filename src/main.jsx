import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./app/store.js";
import AppBootstrap from "./AppBootstrap.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppBootstrap>
        <App />
      </AppBootstrap>
    </Provider>
  </React.StrictMode>,
);
