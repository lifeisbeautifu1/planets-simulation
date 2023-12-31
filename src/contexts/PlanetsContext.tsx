import {
  createContext,
  useContext,
  useCallback,
  useReducer,
  useEffect,
} from "react";

import { useSimulationInformationContext } from "@/contexts/SimulationInformationContext";
import type { SelectedMethod } from "@/lib/types";

interface IPlanetsState {
  deltaT: number;
  planetsAmount: number;
  simulationDuration: number;
  elapsedTime: number;
  clearState: boolean;
  finishedState: boolean;
  selectedMethod: SelectedMethod;
}

type PlanetsAction =
  | {
      type: "SET_SIMULATION_CONFIGURATION";
      params: {
        deltaT: number;
        planetsAmount: number;
        simulationDuration: number;
      };
    }
  | { type: "RESET_ELAPSED_TIME" }
  | { type: "INCREASE_ELAPSED_TIME"; amount: number }
  | { type: "TOGGLE_CLEAR_STATE" }
  | { type: "TOGGLE_FINISHED_STATE" }
  | { type: "SET_SELECTED_METHOD"; method: SelectedMethod }
  | { type: "RESET" };

const planetsReducer = (state: IPlanetsState, action: PlanetsAction) => {
  switch (action.type) {
    case "SET_SIMULATION_CONFIGURATION": {
      return {
        ...state,
        deltaT: action.params.deltaT,
        planetsAmount: action.params.planetsAmount,
        simulationDuration: action.params.simulationDuration,
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
    case "TOGGLE_CLEAR_STATE": {
      return {
        ...state,
        clearState: !state.clearState,
      };
    }
    case "TOGGLE_FINISHED_STATE": {
      return {
        ...state,
        finishedState: !state.finishedState,
      };
    }
    case "SET_SELECTED_METHOD": {
      return {
        ...state,
        selectedMethod: action.method,
      };
    }
    case "RESET": {
      return {
        ...state,
        clearState: !state.clearState,
        elapsedTime: 0,
        finishedState: true,
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
  finishedState: boolean;
  selectedMethod: SelectedMethod;
  start: () => void;
  clear: () => void;
  stop: () => void;
  dispatch: React.Dispatch<PlanetsAction>;
}

const PlanetsContext = createContext<IPlanetsContext>({
  deltaT: 60 * 60 * 24,
  planetsAmount: 2,
  simulationDuration: 60 * 60 * 24 * 365 * 20,
  elapsedTime: 0,
  finishedState: false,
  clearState: false,
  selectedMethod: "Euler-Kramer",
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
    planetsAmount: 2,
    simulationDuration: 60 * 60 * 24 * 365 * 20,
    elapsedTime: 0,
    clearState: false,
    finishedState: false,
    selectedMethod: "Euler-Kramer",
  });

  const { setIsSimulationInformationOpen } = useSimulationInformationContext();

  useEffect(() => {
    if (planetsState.elapsedTime > planetsState.simulationDuration) {
      setIsSimulationInformationOpen(true);
      dispatch({ type: "TOGGLE_FINISHED_STATE" });
    }
  }, [
    planetsState.elapsedTime,
    planetsState.simulationDuration,
    dispatch,
    setIsSimulationInformationOpen,
  ]);

  useEffect(() => {
    dispatch({ type: "RESET" });
  }, [planetsState.selectedMethod, dispatch]);

  const start = useCallback(() => {
    dispatch({ type: "RESET_ELAPSED_TIME" });
    dispatch({ type: "TOGGLE_FINISHED_STATE" });
  }, [dispatch]);

  const stop = useCallback(() => {
    dispatch({ type: "TOGGLE_FINISHED_STATE" });
  }, [dispatch]);

  const clear = useCallback(() => {
    dispatch({ type: "TOGGLE_CLEAR_STATE" });
  }, [dispatch]);

  return (
    <PlanetsContext.Provider
      value={{
        ...planetsState,
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
