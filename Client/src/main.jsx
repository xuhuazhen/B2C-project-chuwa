import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from "./store/store";

// const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  // <QueryClientProvider client={queryClient}>
  <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}> 
        <App />
      </PersistGate>
  </Provider>
  // sync loacal storge to cart
  // </QueryClientProvider>
);
