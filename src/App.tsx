import { useState, useRef, useEffect, useCallback } from "react";

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

const thirdPlanent: Planet = {
  x: 149600000000 * 2,
  y: 0,
  vx: 0,
  vy: Math.sqrt((G * M) / 149600000000 / 2),
  m: EARTH_MASS * 2,
  energy: 0,
};

const fourthPlanet: Planet = {
  x: 149600000000 * 3,
  y: 0,
  vx: 0,
  vy: Math.sqrt((G * M) / 149600000000 / 3),
  m: EARTH_MASS * 3,
  energy: 0,
};

const App = () => {
  const [planets, setPlanets] = useState<Array<Planet>>([
    firstPlanet,
    secondPlanet,
    thirdPlanent,
    fourthPlanet,
  ]);
  const [t, setT] = useState(360000);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const solveEuler = useCallback(() => {
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
  }, [planets, t]);

  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      const centerX = 200;
      const centerY = 200;
      const radius = 20;

      if (context) {
        planets.forEach((planet) => {
          const { x, y } = planet;
          context.beginPath();
          console.log(
            "planent x",
            planet,
            centerX + (x * 400) / planets[planets.length - 1].x / 2
          );
          console.log(
            "planent y",
            planet,
            centerY + (y * 400) / planets[planets.length - 1].x / 2
          );
          context.arc(
            centerX + (x * 400) / planets[planets.length - 1].x / 2,
            centerY + (y * 400) / planets[planets.length - 1].x / 2,
            radius,
            0,
            2 * Math.PI,
            false
          );
          context.fillStyle = "yellow";
          context.fill();
          context.lineWidth = 5;
          context.strokeStyle = "orange";
          context.stroke();
        });
      }
    }
  }, [canvasRef, planets]);

  // console.log(planets);

  // useEffect(() => {
  //   const interval = setInterval(() => solveEuler(), 100);
  //   return () => clearInterval(interval);
  // }, [canvasRef, solveEuler]);

  return (
    <div>
      to be continued...
      <pre>{JSON.stringify(planets, null, 4)}</pre>
      <Button className="m-4" onClick={solveEuler}>
        Solve
      </Button>
      <canvas ref={canvasRef} width={400} height={400}></canvas>
    </div>
  );
};

export default App;
