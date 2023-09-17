import { useState, useRef, useEffect } from "react";

import { EARTH_DISTANCE_FROM_SUN, STARS_AMOUNT } from "@/lib/constants";
import { Star } from "@/lib/utils";
import { ContextMenu, SimulationInformationPopover } from "@/components/ui";
import { usePlanetsContext } from "@/contexts";
import {
  usePlanets,
  useEuler,
  useEulerKramer,
  useVerlet,
  useBeeman,
} from "@/hooks";
import SunImage from "@/assets/img/sun.png";
import EarthImage from "@/assets/img/earth.png";
import MarsImage from "@/assets/img/mars.png";

const Sun = new Image();
Sun.src = SunImage;
const Earth = new Image();
Earth.src = EarthImage;
const Mars = new Image();
Mars.src = MarsImage;

const planetsImages = [Sun, Earth, Mars];

const App = () => {
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [stars, setStars] = useState<Array<Star>>([]);

  const {
    deltaT,
    planetsAmount,
    finishedState,
    clearState,
    selectedMethod,
    dispatch,
    start,
  } = usePlanetsContext();

  const { planets, setPlanets, ...infoPopoverProps } = usePlanets({
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
    const tmp = [];
    for (let i = 0; i < STARS_AMOUNT; i++) {
      const x = Math.round(Math.random() * canvasDimensions.width);
      const y = Math.round(Math.random() * canvasDimensions.height);
      const length = 1 + Math.random() * 2;
      const opacity = Math.random();

      const star = new Star(x, y, length, opacity);

      tmp.push(star);
    }
    setStars(tmp);
  }, [canvasDimensions]);

  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      const centerX = canvasDimensions.width / 2;
      const centerY = canvasDimensions.height / 2;
      if (context) {
        requestAnimationFrame(() => {
          context.clearRect(
            0,
            0,
            canvasDimensions.width,
            canvasDimensions.height
          );
          stars.forEach((star) =>
            star.draw(context, canvasDimensions.width, canvasDimensions.height)
          );
          planets.forEach((planet, i) => {
            const { x, y } = planet;
            const imageSize = i === 0 ? 200 : 50;
            context.drawImage(
              planetsImages[i],
              centerX +
                (x * canvasDimensions.width) /
                  EARTH_DISTANCE_FROM_SUN /
                  (planetsAmount * 1.75) -
                imageSize / 2,
              centerY +
                (y * canvasDimensions.height) /
                  EARTH_DISTANCE_FROM_SUN /
                  (planetsAmount * 1.75) -
                imageSize / 2,
              imageSize,
              imageSize
            );
          });
        });
      }
    }
  }, [canvasRef, planets, planetsAmount, canvasDimensions, stars]);

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
    <div className="flex items-center justify-center font-primary">
      <ContextMenu />
      <SimulationInformationPopover {...infoPopoverProps} />
      <canvas
        ref={canvasRef}
        width={canvasDimensions.width}
        height={canvasDimensions.height}
      />
    </div>
  );
};

export default App;
