import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
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
    <motion.div drag className="absolute z-20 cursor-grab">
      <Card className="pr-8 min-w-[550px]">
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
    </motion.div>
  ) : null;
};
