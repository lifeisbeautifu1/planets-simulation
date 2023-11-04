import { useCallback, useRef } from "react";

import type { Planet } from "@/lib/types";
import { G, SPEED_OF_LIGHT } from "@/lib/constants";

const useBeeman = ({
  planets,
  setPlanets,
  deltaT,
}: {
  planets: Planet[];
  deltaT: number;
  setPlanets: React.Dispatch<React.SetStateAction<Planet[]>>;
}) => {
  const aX = useRef(new Array(planets.length).fill(0).map(() => [0]));
  const aY = useRef(new Array(planets.length).fill(0).map(() => [0]));

  const solveBeeman = useCallback(() => {
    const updatedPlanets = [...planets];
    planets.forEach((planet, index) => {
      const { x, y, vx, vy, m, m0, q, B } = planet;
      let accX = 0,
        accY = 0,
        potentialEnergy = 0,
        kineticEnergy = 0;
      planets.forEach((p, j) => {
        if (j !== index) {
          const R = Math.sqrt((x - p.x) ** 2 + (y - p.y) ** 2);
          accX += (G * p.m * (p.x - x)) / R ** 3;
          accY += (G * p.m * (p.y - y)) / R ** 3;
          potentialEnergy -= (G * p.m * m) / R;
        }
      });
      kineticEnergy = (m * (vx ** 2 + vy ** 2)) / 2;
      accX += (Math.abs(q) * vx * B) / m;
      accY += (Math.abs(q) * vy * B) / m;
      if (aX.current[index].length >= 2) {
        const updatedX =
          x +
          vx * deltaT -
          (4 * aX.current[index][aX.current[index].length - 1] -
            aX.current[index][aX.current[index].length - 2]) *
            deltaT ** 2 *
            (1 / 6);
        const updatedY =
          y +
          vy * deltaT -
          (4 * aY.current[index][aY.current[index].length - 1] -
            aY.current[index][aY.current[index].length - 2]) *
            deltaT ** 2 *
            (1 / 6);
        const updatedVx =
          vx +
          (2 * accX +
            5 * aX.current[index][aX.current[index].length - 1] -
            aX.current[index][aX.current[index].length - 2]) *
            deltaT *
            (1 / 6);
        const updatedVy =
          vy +
          (2 * accY +
            5 * aY.current[index][aY.current[index].length - 1] -
            aY.current[index][aY.current[index].length - 2]) *
            deltaT *
            (1 / 6);
        updatedPlanets[index] = {
          ...planet,
          vx: updatedVx,
          vy: updatedVy,
          x: updatedX,
          y: updatedY,
          m: m0 / Math.sqrt(1 - (vx ** 2 + vy ** 2) / SPEED_OF_LIGHT ** 2),
          energy: kineticEnergy + potentialEnergy,
        };
      } else {
        const updatedVx = vx + accX * deltaT;
        const updatedVy = vy + accY * deltaT;
        const updatedX = x + updatedVx * deltaT;
        const updatedY = y + updatedVy * deltaT;
        updatedPlanets[index] = {
          ...planet,
          vx: updatedVx,
          vy: updatedVy,
          x: updatedX,
          y: updatedY,
          // m: m0 / Math.sqrt(1 - (vx ** 2 + vy ** 2) / SPEED_OF_LIGHT ** 2),
          energy: kineticEnergy + potentialEnergy,
        };
      }
      aX.current[index].push(accX);
      aY.current[index].push(accY);
    });

    setPlanets(updatedPlanets);
  }, [planets, deltaT, setPlanets]);

  return solveBeeman;
};

export default useBeeman;
