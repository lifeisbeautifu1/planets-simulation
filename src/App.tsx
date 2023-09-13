import { useState, useRef, useEffect, useCallback } from "react";

import { G, M, EARTH_MASS, EARTH_DISTANCE_FROM_SUN } from "@/lib/constants";
import type { Planet } from "@/lib/types";

const App = () => {
  const [planets, setPlanets] = useState<Array<Planet>>(
    new Array(3).fill(0).map((_, i) => ({
      x: EARTH_DISTANCE_FROM_SUN * i,
      y: 0,
      vx: 0,
      vy: i === 0 ? 0 : Math.sqrt((G * M) / EARTH_DISTANCE_FROM_SUN / i),
      m: i === 0 ? M : EARTH_MASS * i,
      energy: 0,
    }))
  );
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [planetsAmount, setPlanetsAmount] = useState(3);

  const [t, setT] = useState(60 * 60 * 24 * 7);

  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      context?.clearRect(0, 0, canvasDimensions.width, canvasDimensions.height);
    }
  }, [planetsAmount, canvasRef, canvasDimensions]);

  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      const centerX = canvasDimensions.width / 2;
      const centerY = canvasDimensions.height / 2;
      const radius = 20;

      if (context) {
        planets.forEach((planet, i) => {
          requestAnimationFrame(() => {
            const { x, y } = planet;
            context.beginPath();
            context.arc(
              centerX +
                (x * canvasDimensions.width) /
                  EARTH_DISTANCE_FROM_SUN /
                  (planetsAmount * 3),
              centerY +
                (y * canvasDimensions.height) /
                  EARTH_DISTANCE_FROM_SUN /
                  (planetsAmount * 3),
              i === 0 ? radius * 2 : radius,
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
        });
      }
    }
  }, [canvasRef, planets, planetsAmount, canvasDimensions]);

  useEffect(() => {
    const interval = setInterval(() => solveEuler(), 33);
    return () => clearInterval(interval);
  }, [canvasRef, solveEuler]);

  return (
    <div className="flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={canvasDimensions.width}
        height={canvasDimensions.height}
      ></canvas>
    </div>
  );
};

export default App;
