import { useState, useEffect, useMemo } from "react";

import { G, M, EARTH_MASS, EARTH_DISTANCE_FROM_SUN } from "@/lib/constants";
import type { Planet } from "@/lib/types";

const usePlanets = ({
  planetsAmount,
  clearState,
}: {
  planetsAmount: number;
  clearState: boolean;
}) => {
  const [planets, setPlanets] = useState<Array<Planet>>(
    new Array(planetsAmount).fill(0).map((_, i) => ({
      x: EARTH_DISTANCE_FROM_SUN * i,
      y: 0,
      vx: 0,
      vy: i === 0 ? 0 : Math.sqrt((G * M) / EARTH_DISTANCE_FROM_SUN / i),
      m0: i === 0 ? M : EARTH_MASS * i,
      m: i === 0 ? M : EARTH_MASS * i,
      energy: 0,
      q: i === 0 ? -4 * 10 ** 26 : -3 * 10 ** 18,
      B: 3 * 10 ** -4,
    }))
  );

  const [startingPlanets, setStartingPlanets] = useState<Array<Planet>>(
    new Array(planetsAmount).fill(0).map((_, i) => ({
      x: EARTH_DISTANCE_FROM_SUN * i,
      y: 0,
      vx: 0,
      vy: i === 0 ? 0 : Math.sqrt((G * M) / EARTH_DISTANCE_FROM_SUN / i),
      m0: i === 0 ? M : EARTH_MASS * i,
      m: i === 0 ? M : EARTH_MASS * i,
      energy: 0,
      q: i === 0 ? -4 * 10 ** 27 : -3 * 10 ** 19,
      B: 3 * 10 ** -4,
    }))
  );

  useEffect(() => {
    setPlanets(startingPlanets);
  }, [startingPlanets]);

  const vX = useMemo(() => {
    const { totalMomentum, totalMass } = planets.reduce(
      (acc, planet) => ({
        totalMomentum: acc.totalMomentum + planet.m * planet.vx,
        totalMass: acc.totalMass + planet.m,
      }),
      {
        totalMomentum: 0,
        totalMass: 0,
      }
    );
    return totalMomentum / totalMass;
  }, [planets]);

  const vY = useMemo(() => {
    const { totalMomentum, totalMass } = planets.reduce(
      (acc, planet) => ({
        totalMomentum: acc.totalMomentum + planet.m * planet.vy,
        totalMass: acc.totalMass + planet.m,
      }),
      {
        totalMomentum: 0,
        totalMass: 0,
      }
    );
    return totalMomentum / totalMass;
  }, [planets]);

  const totalEnergy = useMemo(() => {
    return planets.reduce((acc, planet) => acc + planet.energy, 0);
  }, [planets]);

  useEffect(() => {
    setPlanets(() => {
      return new Array(planetsAmount).fill(0).map((_, i) => ({
        x: EARTH_DISTANCE_FROM_SUN * i,
        y: 0,
        vx: 0,
        vy: i === 0 ? 0 : Math.sqrt((G * M) / EARTH_DISTANCE_FROM_SUN / i),
        m0: i === 0 ? M : EARTH_MASS * i,
        m: i === 0 ? M : EARTH_MASS * i,
        energy: 0,
        q: i === 0 ? -4 * 10 ** 27 : -3 * 10 ** 19,
        B: 3 * 10 ** -4,
      }));
    });
    setStartingPlanets(() => {
      return new Array(planetsAmount).fill(0).map((_, i) => ({
        x: EARTH_DISTANCE_FROM_SUN * i,
        y: 0,
        vx: 0,
        vy: i === 0 ? 0 : Math.sqrt((G * M) / EARTH_DISTANCE_FROM_SUN / i),
        m0: i === 0 ? M : EARTH_MASS * i,
        m: i === 0 ? M : EARTH_MASS * i,
        energy: 0,
        q: i === 0 ? -4 * 10 ** 27 : -3 * 10 ** 19,
        B: 3 * 10 ** -4,
      }));
    });
  }, [planetsAmount]);

  useEffect(() => {
    setPlanets(startingPlanets);
  }, [clearState, startingPlanets, setPlanets]);

  return {
    planets,
    setPlanets,
    vX,
    vY,
    totalEnergy,
    startingPlanets,
    setStartingPlanets,
  } as const;
};

export default usePlanets;
