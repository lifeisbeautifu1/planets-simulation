import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import PlanetsContextProvider from "./contexts/PlanetsContext.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PlanetsContextProvider>
      <App />
    </PlanetsContextProvider>
  </React.StrictMode>
);
