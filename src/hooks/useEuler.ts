import { useCallback } from "react";

import type { Planet } from "@/lib/types";
import { G } from "@/lib/constants";

const useEuler = ({
  planets,
  setPlanets,
  deltaT,
}: {
  planets: Planet[];
  deltaT: number;
  setPlanets: React.Dispatch<React.SetStateAction<Planet[]>>;
}) => {
  const solveEuler = useCallback(() => {
    const updatedPlanets = [...planets];
    planets.forEach((planet, index) => {
      const { x, y, vx, vy } = planet;
      let aX = 0,
        aY = 0;
      planets.forEach((p, j) => {
        if (j !== index) {
          const R = Math.sqrt((x - p.x) ** 2 + (y - p.y) ** 2);
          aX += (G * p.m * (p.x - x)) / R ** 3;
          aY += (G * p.m * (p.y - y)) / R ** 3;
        }
      });
      const updatedVx = vx + aX * deltaT;
      const updatedVy = vy + aY * deltaT;
      updatedPlanets[index] = {
        ...planet,
        vx: updatedVx,
        vy: updatedVy,
        x: x + updatedVx * deltaT,
        y: y + updatedVy * deltaT,
      };
    });
    setPlanets(updatedPlanets);
  }, [planets, deltaT, setPlanets]);

  return solveEuler;
};

export default useEuler;
