import SunImage from "@/assets/img/sun.png";
import EarthImage from "@/assets/img/earth.png";
import MarsImage from "@/assets/img/mars.png";

const Sun = new Image();
Sun.src = SunImage;
const Earth = new Image();
Earth.src = EarthImage;
const Mars = new Image();
Mars.src = MarsImage;

export const PlanetsImages = [Sun, Earth, Mars];
