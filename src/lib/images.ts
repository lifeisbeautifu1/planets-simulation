import SunImage from "@/assets/img/sun.png";
import EarthImage from "@/assets/img/earth.png";
import MarsImage from "@/assets/img/mars.png";
import MercuryImage from "@/assets/img/mercury.png";
import VenusImage from "@/assets/img/venus.png";

const Sun = new Image();
Sun.src = SunImage;
const Earth = new Image();
Earth.src = EarthImage;
const Mars = new Image();
Mars.src = MarsImage;
const Mercury = new Image();
Mercury.src = MercuryImage;
const Venus = new Image();
Venus.src = VenusImage;

export const PlanetsImages = [Sun, Mercury, Venus, Earth, Mars];
