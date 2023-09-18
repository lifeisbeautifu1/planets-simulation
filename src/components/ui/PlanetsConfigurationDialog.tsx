import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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

  const [formState, setFormState] = useState(startingPlanets);

  useEffect(() => {
    setFormState(startingPlanets);
  }, [startingPlanets]);

  const handleOpenChange = useCallback(
    (open: boolean) => setIsPlanetsConfigurationOpen(open),
    [setIsPlanetsConfigurationOpen]
  );

  const handleSubmit = useCallback(() => {
    setStartingPlanets(
      formState.map(({ x, y, m, vx, vy, ...rest }) => ({
        ...rest,
        x: +x,
        y: +y,
        m: +m,
        vx: +vx,
        vy: +vy,
      }))
    );
    setIsPlanetsConfigurationOpen(false);
  }, [setIsPlanetsConfigurationOpen, formState, setStartingPlanets]);

  return (
    <Dialog open={isPlanetsConfigurationOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Planets configuration</DialogTitle>
          <DialogDescription>A list of your planets.</DialogDescription>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mass</TableHead>
              <TableHead>X</TableHead>
              <TableHead>Y</TableHead>
              <TableHead>vX</TableHead>
              <TableHead>vY</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formState.map(({ m, x, y, vx, vy }, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Input
                    value={m}
                    onChange={(event) => {
                      setFormState((p) =>
                        p.map((planet, i) =>
                          i === index
                            ? {
                                ...planet,
                                m: event.target.value as unknown as number,
                              }
                            : planet
                        )
                      );
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={x}
                    onChange={(event) => {
                      setFormState((p) =>
                        p.map((planet, i) =>
                          i === index
                            ? {
                                ...planet,
                                x: event.target.value as unknown as number,
                              }
                            : planet
                        )
                      );
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={y}
                    onChange={(event) => {
                      setFormState((p) =>
                        p.map((planet, i) =>
                          i === index
                            ? {
                                ...planet,
                                y: event.target.value as unknown as number,
                              }
                            : planet
                        )
                      );
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={vx}
                    onChange={(event) => {
                      setFormState((p) =>
                        p.map((planet, i) =>
                          i === index
                            ? {
                                ...planet,
                                vx: event.target.value as unknown as number,
                              }
                            : planet
                        )
                      );
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={vy}
                    onChange={(event) => {
                      setFormState((p) =>
                        p.map((planet, i) =>
                          i === index
                            ? {
                                ...planet,
                                vy: event.target.value as unknown as number,
                              }
                            : planet
                        )
                      );
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button onClick={handleSubmit}>Save</Button>
      </DialogContent>
    </Dialog>
  );
};

export default PlanetsConfigurationDialog;
