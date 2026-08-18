import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { ApolloProvider } from "@apollo/client/react";

import client from "./apolloClient";
import RealtimeProvider from "./components/RealtimeProvider";

import { Provider } from "react-redux";
import { store } from "./redux/store";

import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <RealtimeProvider>
          <Provider store={store}>
            <App />
          </Provider>
        </RealtimeProvider>
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
