import { createContext, useContext, useState, useCallback } from "react";

interface SimulationInformationContext {
  isSimulationInformationOpen: boolean;
  openSimulationInformation: () => void;
  closeSimulationInformation: () => void;
}

const SimulationInformationContext =
  createContext<SimulationInformationContext>({
    isSimulationInformationOpen: false,
    openSimulationInformation: () => {},
    closeSimulationInformation: () => {},
  });

const SimulationInformationContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isSimulationInformationOpen, setIsSimulationInformationOpen] =
    useState(false);

  const openSimulationInformation = useCallback(() => {
    setIsSimulationInformationOpen(true);
  }, [setIsSimulationInformationOpen]);

  const closeSimulationInformation = useCallback(() => {
    setIsSimulationInformationOpen(false);
  }, [setIsSimulationInformationOpen]);

  return (
    <SimulationInformationContext.Provider
      value={{
        isSimulationInformationOpen,
        openSimulationInformation,
        closeSimulationInformation,
      }}
    >
      {children}
    </SimulationInformationContext.Provider>
  );
};

export default SimulationInformationContextProvider;

export const useSimulationInformationContext = () =>
  useContext(SimulationInformationContext);
