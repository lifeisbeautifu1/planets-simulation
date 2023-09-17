import { useCallback, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { usePlanetsContext, useSimulationInformationContext } from "@/contexts";
import { Button } from "@/components/ui/button";

export interface SheetProps {
  vX: number;
  vY: number;
  totalEnergy: number;
}

const SheetBase: React.FC<SheetProps> = ({ vX, vY, totalEnergy }) => {
  const {
    elapsedTime,
    simulationDuration,
    dispatch,
    planetsAmount,
    deltaT,
    clear,
    stop,
  } = usePlanetsContext();

  const [formState, setFormState] = useState({
    planetsAmount,
    deltaT,
    simulationDuration,
  });

  const { isSimulationInformationOpen, setIsSimulationInformationOpen } =
    useSimulationInformationContext();

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsSimulationInformationOpen(open);
    },
    [setIsSimulationInformationOpen]
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((p) => ({
        ...p,
        [event.target.name]: +event.target.value,
      }));
    },
    [setFormState]
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      stop();
      clear();
      dispatch({
        type: "SET_SIMULATION_CONFIGURATION",
        params: {
          planetsAmount: formState.planetsAmount,
          deltaT: formState.deltaT,
          simulationDuration: formState.simulationDuration,
        },
      });
    },
    [clear, stop, dispatch, formState]
  );

  return (
    <Sheet open={isSimulationInformationOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="font-primary">
        <SheetHeader>
          <SheetTitle className="text-2xl">Simulation information</SheetTitle>
          <p>Elapsed time: {elapsedTime / 60 / 60 / 24} days.</p>
          <Progress value={(elapsedTime / simulationDuration) * 100} />
          <p>E: {totalEnergy}</p>
          <p>vX: {vX}</p>
          <p>vY: {vY}</p>
          <SheetTitle className="text-2xl mt-8">
            Simulation configuration
          </SheetTitle>
          <form onSubmit={handleSubmit}>
            <Label htmlFor="planetsAmount">
              Planets amount
              <Input
                name="planetsAmount"
                id="planetsAmount"
                type="text"
                value={formState.planetsAmount}
                onChange={handleChange}
              />
            </Label>
            <div className="mt-4">
              <Label htmlFor="deltaT">
                Time step
                <Input
                  name="deltaT"
                  id="deltaT"
                  type="text"
                  value={formState.deltaT}
                  onChange={handleChange}
                />
              </Label>
            </div>
            <div className="mt-4">
              <Label htmlFor="simulationDuration">
                Simulation duration
                <Input
                  name="simulationDuration"
                  id="simulationDuration"
                  type="text"
                  value={formState.simulationDuration}
                  onChange={handleChange}
                />
              </Label>
            </div>
            <div>
              <Button className="mt-4 w-full">Save</Button>
            </div>
          </form>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default SheetBase;
