import { useState } from "react";

import { Button } from "./components/ui/button";
import { G, M, EARTH_MASS } from "@/lib/constants";
import type { Planet } from "@/lib/types";

/* Initialization */
// Sun
const firstPlanet: Planet = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  m: M,
  energy: 0,
};
// Earth
const secondPlanet: Planet = {
  x: 149600000000,
  y: 0,
  vx: 0,
  vy: Math.sqrt((G * M) / 149600000000),
  m: EARTH_MASS,
  energy: 0,
};

const App = () => {
  const [planets, setPlanets] = useState([firstPlanet, secondPlanet]);
  const [t, setT] = useState(1000 * 60 * 60 * 24);

  const solveEuler = () => {
    const updatedPlanets = [...planets];
    planets.forEach((planet, index, arr) => {
      const { x, y, vx, vy } = planet;
      let aX = 0,
        aY = 0;
      arr.forEach((p, j) => {
        if (j !== index) {
          const R = Math.sqrt((x - p.x) ** 2 + (y - p.y) ** 2);
          aX += (G * p.m * (p.x - x)) / R ** 3;
          aY += (G * p.m * (p.y - y)) / R ** 3;
        }
      });
      const updatedVx = vx + aX * t;
      const updatedVy = vy + aY * t;
      updatedPlanets[index] = {
        ...planet,
        vx: updatedVx,
        vy: updatedVy,
        x: x + updatedVx * t,
        y: y + updatedVy * t,
      };
    });
    setPlanets(updatedPlanets);
  };
  console.log(planets);

  return (
    <div>
      to be continued...
      <pre>{JSON.stringify(planets, null, 4)}</pre>
      <Button className="m-4" onClick={solveEuler}>
        Solve
      </Button>
    </div>
  );
};

export default App;
