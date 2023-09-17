import { createContext, useContext, useState } from "react";

interface SimulationInformationContext {
  isSimulationInformationOpen: boolean;
  setIsSimulationInformationOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SimulationInformationContext =
  createContext<SimulationInformationContext>({
    isSimulationInformationOpen: false,
    setIsSimulationInformationOpen: () => {},
  });

const SimulationInformationContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isSimulationInformationOpen, setIsSimulationInformationOpen] =
    useState(false);

  return (
    <SimulationInformationContext.Provider
      value={{
        isSimulationInformationOpen,
        setIsSimulationInformationOpen,
      }}
    >
      {children}
    </SimulationInformationContext.Provider>
  );
};

export default SimulationInformationContextProvider;

export const useSimulationInformationContext = () =>
  useContext(SimulationInformationContext);
