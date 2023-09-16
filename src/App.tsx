import { useState, useRef, useEffect } from "react";

import { EARTH_DISTANCE_FROM_SUN } from "@/lib/constants";
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
      const radius = 20;

      if (context) {
        requestAnimationFrame(() => {
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

  return (
    <div className="flex items-center justify-center bg-black">
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
