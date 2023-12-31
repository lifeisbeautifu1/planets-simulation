import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App.tsx";
import { Toaster } from "@/components/ui/toaster";
import {
  PlanetsContextProvider,
  SimulationInformationContextProvider,
  VisualContextProvider,
} from "@/contexts";
import { ThemeProvider } from "@/components/ui";
import "@/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SimulationInformationContextProvider>
        <PlanetsContextProvider>
          <VisualContextProvider>
            <App />
            <Toaster />
          </VisualContextProvider>
        </PlanetsContextProvider>
      </SimulationInformationContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);
