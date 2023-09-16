import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import {
  PlanetsContextProvider,
  SimulationInformationContextProvider,
} from "@/contexts";
import { ThemeProvider } from "@/components/ui";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <PlanetsContextProvider>
        <SimulationInformationContextProvider>
          <App />
        </SimulationInformationContextProvider>
      </PlanetsContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);
