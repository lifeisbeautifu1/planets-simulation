import {
  createContext,
  useContext,
  useRef,
  useCallback,
  useReducer,
} from "react";

interface IPlanetsState {
  deltaT: number;
  planetsAmount: number;
  simulationDuration: number;
  elapsedTime: number;
  clearState: boolean;
}

type PlanetsAction =
  | { type: "SET_DELTAT"; deltaT: number }
  | { type: "SET_PLANETS_AMOUNT"; planetsAmount: number }
  | { type: "SET_SIMULATION_DURATION"; simulationDuration: number }
  | { type: "RESET_ELAPSED_TIME" }
  | { type: "INCREASE_ELAPSED_TIME"; amount: number }
  | { type: "RESET_CLEAR_STATE" };

const planetsReducer = (state: IPlanetsState, action: PlanetsAction) => {
  switch (action.type) {
    case "SET_DELTAT": {
      return {
        ...state,
        deltaT: action.deltaT,
      };
    }
    case "SET_PLANETS_AMOUNT": {
      return {
        ...state,
        planetsAmount: action.planetsAmount,
      };
    }
    case "SET_SIMULATION_DURATION": {
      return {
        ...state,
        simulationDuration: action.simulationDuration,
      };
    }
    case "RESET_ELAPSED_TIME": {
      return {
        ...state,
        elapsedTime: 0,
      };
    }
    case "INCREASE_ELAPSED_TIME": {
      return {
        ...state,
        elapsedTime: state.elapsedTime + action.amount,
      };
    }
    case "RESET_CLEAR_STATE": {
      return {
        ...state,
        clearState: !state.clearState,
      };
    }
    default:
      return state;
  }
};

interface IPlanetsContext {
  deltaT: number;
  planetsAmount: number;
  simulationDuration: number;
  elapsedTime: number;
  clearState: boolean;
  finishedRef: React.MutableRefObject<boolean>;
  start: () => void;
  clear: () => void;
  stop: () => void;
  dispatch: React.Dispatch<PlanetsAction>;
}

const PlanetsContext = createContext<IPlanetsContext>({
  deltaT: 60 * 60 * 24,
  planetsAmount: 3,
  simulationDuration: 60 * 60 * 24 * 365 * 200,
  elapsedTime: 0,
  finishedRef: { current: false },
  clearState: false,
  start: () => null,
  clear: () => null,
  stop: () => null,
  dispatch: () => null,
});

const PlanetsContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [planetsState, dispatch] = useReducer(planetsReducer, {
    deltaT: 60 * 60 * 24,
    planetsAmount: 3,
    simulationDuration: 60 * 60 * 24 * 365 * 200,
    elapsedTime: 0,
    clearState: false,
  });

  const finishedRef = useRef(false);

  const start = useCallback(() => {
    dispatch({ type: "RESET_ELAPSED_TIME" });
    finishedRef.current = false;
  }, [finishedRef, dispatch]);

  const stop = useCallback(() => {
    finishedRef.current = true;
  }, [finishedRef, dispatch]);

  const clear = useCallback(() => {
    dispatch({ type: "RESET_CLEAR_STATE" });
  }, [dispatch]);

  return (
    <PlanetsContext.Provider
      value={{
        ...planetsState,
        finishedRef,
        start,
        clear,
        dispatch,
        stop,
      }}
    >
      {children}
    </PlanetsContext.Provider>
  );
};

export default PlanetsContextProvider;

export const usePlanetsContext = () => useContext(PlanetsContext);
