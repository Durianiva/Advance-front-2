import { Provider } from "react-redux";
import { store } from "./store/redux/store";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import "./global.css";
import App from "./App.jsx";
import DataBoundary from "./components/DataBoundary";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
    <BrowserRouter>
      <DataBoundary><App /></DataBoundary>
    </BrowserRouter>
    </Provider>
  </StrictMode>
);
