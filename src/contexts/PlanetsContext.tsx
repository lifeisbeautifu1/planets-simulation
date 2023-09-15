import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from "react";

interface IPlanetsContext {
  deltaT: number;
  setDeltaT: React.Dispatch<React.SetStateAction<number>>;
  planetsAmount: number;
  setPlanetsAmount: React.Dispatch<React.SetStateAction<number>>;
  simulationDuration: number;
  setSimulationDuration: React.Dispatch<React.SetStateAction<number>>;
  elapsedTime: number;
  setElapsedTime: React.Dispatch<React.SetStateAction<number>>;
  finishedRef: React.MutableRefObject<boolean>;
  start: () => void;
  clear: () => void;
  clearState: boolean;
  setClearState: React.Dispatch<React.SetStateAction<boolean>>;
}

const PlanetsContext = createContext<IPlanetsContext>({
  deltaT: 60 * 60 * 24 * 7,
  setDeltaT: () => null,
  planetsAmount: 3,
  setPlanetsAmount: () => null,
  simulationDuration: 60 * 60 * 24 * 365,
  setSimulationDuration: () => null,
  elapsedTime: 0,
  setElapsedTime: () => null,
  finishedRef: { current: false },
  start: () => null,
  clear: () => null,
  clearState: false,
  setClearState: () => null,
});

const PlanetsContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [deltaT, setDeltaT] = useState(60 * 60 * 24 * 7);
  const [simulationDuration, setSimulationDuration] = useState(
    60 * 60 * 24 * 365
  );
  const [elapsedTime, setElapsedTime] = useState(0);
  const [planetsAmount, setPlanetsAmount] = useState(3);

  const [clearState, setClearState] = useState(false);

  const finishedRef = useRef(false);

  const start = useCallback(() => {
    setElapsedTime(0);
    finishedRef.current = false;
  }, [finishedRef]);

  const clear = useCallback(() => {
    setClearState((pv) => !pv);
  }, []);

  return (
    <PlanetsContext.Provider
      value={{
        deltaT,
        setDeltaT,
        planetsAmount,
        setPlanetsAmount,
        simulationDuration,
        setSimulationDuration,
        elapsedTime,
        setElapsedTime,
        finishedRef,
        clearState,
        setClearState,
        start,
        clear,
      }}
    >
      {children}
    </PlanetsContext.Provider>
  );
};

export default PlanetsContextProvider;

export const usePlanetsContext = () => useContext(PlanetsContext);
