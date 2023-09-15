import { useState, useEffect } from "react";

import { G, M, EARTH_MASS, EARTH_DISTANCE_FROM_SUN } from "@/lib/constants";
import type { Planet } from "@/lib/types";

const usePlanets = (planetsAmount: number) => {
  const [planets, setPlanets] = useState<Array<Planet>>(
    new Array(planetsAmount).fill(0).map((_, i) => ({
      x: EARTH_DISTANCE_FROM_SUN * i,
      y: 0,
      vx: 0,
      vy: i === 0 ? 0 : Math.sqrt((G * M) / EARTH_DISTANCE_FROM_SUN / i),
      m: i === 0 ? M : EARTH_MASS * i,
      energy: 0,
    }))
  );

  useEffect(() => {
    setPlanets(() => {
      return new Array(planetsAmount).fill(0).map((_, i) => ({
        x: EARTH_DISTANCE_FROM_SUN * i,
        y: 0,
        vx: 0,
        vy: i === 0 ? 0 : Math.sqrt((G * M) / EARTH_DISTANCE_FROM_SUN / i),
        m: i === 0 ? M : EARTH_MASS * i,
        energy: 0,
      }));
    });
  }, [planetsAmount]);

  return [planets, setPlanets] as const;
};

export default usePlanets;
