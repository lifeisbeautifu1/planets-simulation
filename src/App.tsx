import { useState, useRef, useEffect } from "react";

import { useToast } from "@/components/ui/use-toast";
import {
  EARTH_DISTANCE_FROM_SUN,
  PLANET_COLORS,
  STARS_AMOUNT,
} from "@/lib/constants";
import { Star } from "@/lib/utils";
import {
  ContextMenu,
  SheetInformation,
  PlanetsConfigurationDialog,
} from "@/components/ui";
import { usePlanetsContext, useVisualContext } from "@/contexts";
import {
  usePlanets,
  useEuler,
  useEulerKramer,
  useVerlet,
  useBeeman,
} from "@/hooks";
import { PlanetsImages } from "@/lib/images";

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

  const {
    planets,
    setPlanets,
    startingPlanets,
    setStartingPlanets,
    ...sheetProps
  } = usePlanets({
    planetsAmount,
    clearState,
  });

  const { renderingType } = useVisualContext();

  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(
      () =>
        toast({
          title: "Tip",
          description: "Right click to change simulation configuration",
        }),
      5000
    );
    return () => clearTimeout(timer);
  }, [toast]);

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
      const radius = 10;
      if (context) {
        requestAnimationFrame(() => {
          if (renderingType === "planets") {
            context.clearRect(
              0,
              0,
              canvasDimensions.width,
              canvasDimensions.height
            );
            stars.forEach((star) =>
              star.draw(
                context,
                canvasDimensions.width,
                canvasDimensions.height
              )
            );
          } else if (renderingType === "circles") {
            context.fillStyle = "rgba(0, 0, 0, 0.2)";
            context.fillRect(
              0,
              0,
              canvasDimensions.width,
              canvasDimensions.height
            );
          }
          planets.forEach((planet, i) => {
            const { x, y } = planet;
            if (renderingType === "planets") {
              const imageSize = i === 0 ? 200 : 50;
              context.drawImage(
                PlanetsImages[i % PlanetsImages.length],
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
            } else {
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
            }
          });
        });
      }
    }
  }, [
    canvasRef,
    planets,
    planetsAmount,
    canvasDimensions,
    stars,
    renderingType,
  ]);

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
      <SheetInformation {...sheetProps} />
      <PlanetsConfigurationDialog
        startingPlanets={startingPlanets}
        setStartingPlanets={setStartingPlanets}
      />
      <canvas
        ref={canvasRef}
        width={canvasDimensions.width}
        height={canvasDimensions.height}
      />
    </div>
  );
};

export default App;
