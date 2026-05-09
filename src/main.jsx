// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./utils/router";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { DbProvider } from "./context/dbContext";
import { AIProvider } from "./context/aiContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <DbProvider>
        <AIProvider>
          <App />
        </AIProvider>
      </DbProvider>
    </AuthProvider>
  </React.StrictMode>
);
