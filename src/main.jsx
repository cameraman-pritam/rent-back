import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { PrimeReactProvider } from "primereact/api";
import { AuthProvider } from "./components/context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PrimeReactProvider>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </PrimeReactProvider>
  </StrictMode>
);
