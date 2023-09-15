import { createContext, useContext, useState } from "react";

interface IPlanetsContext {
  deltaT: number;
  setDeltaT: React.Dispatch<React.SetStateAction<number>>;
  planetsAmount: number;
  setPlanetsAmount: React.Dispatch<React.SetStateAction<number>>;
}

const PlanetsContext = createContext<IPlanetsContext>({
  deltaT: 60 * 60 * 24 * 7,
  setDeltaT: () => null,
  planetsAmount: 3,
  setPlanetsAmount: () => null,
});

const PlanetsContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [deltaT, setDeltaT] = useState(60 * 60 * 24 * 7);
  const [planetsAmount, setPlanetsAmount] = useState(3);
  return (
    <PlanetsContext.Provider
      value={{ deltaT, setDeltaT, planetsAmount, setPlanetsAmount }}
    >
      {children}
    </PlanetsContext.Provider>
  );
};

export default PlanetsContextProvider;

export const usePlanetsContext = () => useContext(PlanetsContext);
