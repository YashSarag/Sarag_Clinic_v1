import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { ApolloProvider } from "@apollo/client/react";

import client from "./apollo/client";
import RealtimeProvider from "./components/RealtimeProvider";

import App from "./App";
import './index.css'

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <RealtimeProvider>
          <App />
        </RealtimeProvider>
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>
);