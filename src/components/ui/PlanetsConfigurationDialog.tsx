import { useCallback } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useVisualContext } from "@/contexts";
import { Planet } from "@/lib/types";

interface PlanetsConfigurationDialogProps {
  startingPlanets: Array<Planet>;
  setStartingPlanets: React.Dispatch<React.SetStateAction<Planet[]>>;
}

const PlanetsConfigurationDialog: React.FC<PlanetsConfigurationDialogProps> = ({
  startingPlanets,
  setStartingPlanets,
}) => {
  const { isPlanetsConfigurationOpen, setIsPlanetsConfigurationOpen } =
    useVisualContext();

  const handleOpenChange = useCallback(
    (open: boolean) => setIsPlanetsConfigurationOpen(open),
    [setIsPlanetsConfigurationOpen]
  );

  return (
    <Dialog open={isPlanetsConfigurationOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PlanetsConfigurationDialog;
