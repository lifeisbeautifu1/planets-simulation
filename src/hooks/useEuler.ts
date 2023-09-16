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
      const { x, y, vx, vy, m } = planet;
      let aX = 0,
        aY = 0,
        potentialEnergy = 0,
        kineticEnergy = 0;
      planets.forEach((p, j) => {
        if (j !== index) {
          const R = Math.sqrt((x - p.x) ** 2 + (y - p.y) ** 2);
          aX += (G * p.m * (p.x - x)) / R ** 3;
          aY += (G * p.m * (p.y - y)) / R ** 3;
          potentialEnergy -= (G * p.m * m) / R;
          kineticEnergy = (m * (G * p.m)) / R / 2;
        }
      });
      updatedPlanets[index] = {
        ...planet,
        vx: vx + aX * deltaT,
        vy: vy + aY * deltaT,
        x: x + vx * deltaT,
        y: y + vy * deltaT,
        energy: kineticEnergy + potentialEnergy,
      };
    });
    setPlanets(updatedPlanets);
  }, [planets, deltaT, setPlanets]);

  return solveEuler;
};

export default useEuler;
