import { useState, useRef, useEffect } from "react";

import { EARTH_DISTANCE_FROM_SUN, PLANET_COLORS } from "@/lib/constants";
import { ContextMenu } from "@/components/ui";
import { usePlanetsContext } from "@/contexts/PlanetsContext";
import {
  usePlanets,
  useEuler,
  useEulerKramer,
  useVerlet,
  useBeeman,
} from "@/hooks";

const App = () => {
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const {
    deltaT,
    planetsAmount,
    elapsedTime,
    finishedState,
    clearState,
    selectedMethod,
    dispatch,
    start,
  } = usePlanetsContext();

  const { planets, setPlanets, vX, vY, totalEnergy } = usePlanets({
    planetsAmount,
    clearState,
  });

  const solveEuler = useEuler({ planets, deltaT, setPlanets });
  const solveEulerKramer = useEulerKramer({ planets, deltaT, setPlanets });
  const solveVerlet = useVerlet({ planets, deltaT, setPlanets });
  const solveBeeman = useBeeman({ planets, deltaT, setPlanets });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const setDimensions = () => {
      setCanvasDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", setDimensions);
    return () => window.removeEventListener("resize", setDimensions);
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      requestAnimationFrame(() => {
        context?.clearRect(
          0,
          0,
          canvasDimensions.width,
          canvasDimensions.height
        );
      });
    }
  }, [canvasRef, canvasDimensions, clearState]);

  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      const centerX = canvasDimensions.width / 2;
      const centerY = canvasDimensions.height / 2;
      const radius = 15;
      if (context) {
        requestAnimationFrame(() => {
          context.fillStyle = "rgba(0, 0, 0, 0.2)";
          context.fillRect(
            0,
            0,
            canvasDimensions.width,
            canvasDimensions.height
          );
          planets.forEach((planet, i) => {
            const { x, y } = planet;
            context.beginPath();
            context.arc(
              centerX +
                (x * canvasDimensions.width) /
                  EARTH_DISTANCE_FROM_SUN /
                  (planetsAmount * 1.75),
              centerY +
                (y * canvasDimensions.height) /
                  EARTH_DISTANCE_FROM_SUN /
                  (planetsAmount * 1.75),
              i === 0 ? 30 : radius,
              0,
              2 * Math.PI,
              true
            );
            context.closePath();
            context.fillStyle = PLANET_COLORS[i % PLANET_COLORS.length];
            context.fill();
          });
        });
      }
    }
  }, [canvasRef, planets, planetsAmount, canvasDimensions]);

  useEffect(() => {
    let idx: number;
    const paint = () => {
      switch (selectedMethod) {
        case "Euler-Kramer":
          {
            solveEulerKramer();
          }
          break;
        case "Euler":
          {
            solveEuler();
          }
          break;
        case "Verlet":
          {
            solveVerlet();
          }
          break;
        case "Beeman":
          {
            solveBeeman();
          }
          break;
      }
      dispatch({ type: "INCREASE_ELAPSED_TIME", amount: deltaT });
      if (!finishedState) {
        idx = requestAnimationFrame(paint);
      }
    };
    idx = (!finishedState && requestAnimationFrame(paint)) || 0;
    return () => cancelAnimationFrame(idx);
  }, [
    solveEulerKramer,
    solveEuler,
    solveVerlet,
    solveBeeman,
    deltaT,
    dispatch,
    finishedState,
    selectedMethod,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => start());
    return () => clearTimeout(timer);
  }, [start]);

  return (
    <div className="flex items-center justify-center">
      <ContextMenu />
      <div className="absolute top-0 left-0">
        vX: {vX}
        <br />
        vY: {vY}
        <br />
        energy: {totalEnergy}
        <br />
        elapsed time: {elapsedTime}
        <br />
        selected method: {selectedMethod}
      </div>
      <canvas
        ref={canvasRef}
        width={canvasDimensions.width}
        height={canvasDimensions.height}
      />
    </div>
  );
};

export default App;
