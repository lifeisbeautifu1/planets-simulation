import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { PlanetsContextProvider } from "@/contexts";
import { ThemeProvider } from "@/components/ui";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <PlanetsContextProvider>
        <App />
      </PlanetsContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);
