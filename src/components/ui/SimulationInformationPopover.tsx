import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";

import { usePlanetsContext, useSimulationInformationContext } from "@/contexts";

export interface InfoPopoverProps {
  vX: number;
  vY: number;
  totalEnergy: number;
}

export const SimulationInformationPopover: React.FC<InfoPopoverProps> = ({
  vX,
  vY,
  totalEnergy,
}) => {
  const { elapsedTime, simulationDuration } = usePlanetsContext();
  const { isSimulationInformationOpen, closeSimulationInformation } =
    useSimulationInformationContext();

  return isSimulationInformationOpen ? (
    <Card className="absolute z-10 top-1/2 left-1/2 pr-8 min-w-[550px] translate-x-[-50%] translate-y-[-50%]">
      <X
        onClick={closeSimulationInformation}
        className="absolute top-4 right-4 text-white cursor-pointer"
      />
      <CardHeader>
        <CardTitle className="text-4xl">Current Session</CardTitle>
        <CardDescription>Simulation Information</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Total energy: {totalEnergy} J</p>
      </CardContent>
      <CardContent>
        <p>Center of mass vX: {vX}</p>
      </CardContent>
      <CardContent>
        <p>Center of mass vY: {vY}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        <p>Elapsed time: {elapsedTime / 60 / 60 / 24} days.</p>
        <Progress value={(elapsedTime / simulationDuration) * 100} />
      </CardFooter>
    </Card>
  ) : null;
};
