import { useCallback, useRef } from "react";

import type { Planet } from "@/lib/types";
import { G } from "@/lib/constants";

const useVerlet = ({
  planets,
  setPlanets,
  deltaT,
}: {
  planets: Planet[];
  deltaT: number;
  setPlanets: React.Dispatch<React.SetStateAction<Planet[]>>;
}) => {
  const X = useRef(
    new Array(planets.length).fill(0).map((_, index) => [planets[index].x])
  );
  const Y = useRef(
    new Array(planets.length).fill(0).map((_, index) => [planets[index].y])
  );

  const solveVerlet = useCallback(() => {
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
        }
      });
      kineticEnergy = (m * (vx ** 2 + vy ** 2)) / 2;
      if (X.current[index].length >= 2) {
        const updatedX =
          2 * X.current[index][X.current[index].length - 1] -
          X.current[index][X.current[index].length - 2] +
          deltaT ** 2 * aX;
        const updatedY =
          2 * Y.current[index][Y.current[index].length - 1] -
          Y.current[index][Y.current[index].length - 2] +
          deltaT ** 2 * aY;
        const updatedVx =
          (updatedX - X.current[index][X.current[index].length - 2]) /
          (2 * deltaT);
        const updatedVy =
          (updatedX - Y.current[index][Y.current[index].length - 2]) /
          (2 * deltaT);
        updatedPlanets[index] = {
          ...planet,
          vx: updatedVx,
          vy: updatedVy,
          x: updatedX,
          y: updatedY,
          energy: kineticEnergy + potentialEnergy,
        };
        X.current[index].push(updatedX);
        Y.current[index].push(updatedY);
      } else {
        const updatedVx = vx + aX * deltaT;
        const updatedVy = vy + aY * deltaT;
        const updatedX = x + updatedVx * deltaT;
        const updatedY = y + updatedVy * deltaT;
        updatedPlanets[index] = {
          ...planet,
          vx: updatedVx,
          vy: updatedVy,
          x: updatedX,
          y: updatedY,
          energy: kineticEnergy + potentialEnergy,
        };
        X.current[index].push(updatedX);
        Y.current[index].push(updatedY);
      }
    });
    setPlanets(updatedPlanets);
  }, [planets, deltaT, setPlanets]);

  return solveVerlet;
};

export default useVerlet;
