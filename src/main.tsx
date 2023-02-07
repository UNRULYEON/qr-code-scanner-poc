import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import ScannerContext from "./ScannerContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ScannerContext elementId="qr-code-reader">
      <App />
    </ScannerContext>
  </React.StrictMode>
);
