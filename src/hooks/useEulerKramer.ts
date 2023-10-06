import { useCallback } from "react";

import type { Planet } from "@/lib/types";
import { G, SPEED_OF_LIGHT } from "@/lib/constants";

const useEulerKramer = ({
  planets,
  setPlanets,
  deltaT,
}: {
  planets: Planet[];
  deltaT: number;
  setPlanets: React.Dispatch<React.SetStateAction<Planet[]>>;
}) => {
  const solveEulerKramer = useCallback(() => {
    const updatedPlanets = [...planets];
    planets.forEach((planet, index) => {
      const { x, y, vx, vy, m, m0, q, B } = planet;
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
        }
      });
      aX += (Math.abs(q) * vx * B) / m;
      aY += (Math.abs(q) * vy * B) / m;
      kineticEnergy = (m * (vx ** 2 + vy ** 2)) / 2;
      const updatedVx = vx + aX * deltaT;
      const updatedVy = vy + aY * deltaT;
      updatedPlanets[index] = {
        ...planet,
        vx: updatedVx,
        vy: updatedVy,
        x: x + updatedVx * deltaT,
        y: y + updatedVy * deltaT,
        m: m0 / Math.sqrt(1 - (vx ** 2 + vy ** 2) / SPEED_OF_LIGHT ** 2),
        energy: kineticEnergy + potentialEnergy,
      };
    });
    setPlanets(updatedPlanets);
  }, [planets, deltaT, setPlanets]);

  return solveEulerKramer;
};

export default useEulerKramer;
