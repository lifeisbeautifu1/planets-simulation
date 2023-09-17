import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Star
 *
 * @param int x
 * @param int y
 * @param int length
 * @param opacity
 */
export class Star {
  x: number;
  y: number;
  length: number;
  opacity: number;
  factor: number;
  increment: number;
  constructor(x: number, y: number, length: number, opacity: number) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.opacity = opacity;
    this.factor = 1;
    this.increment = Math.random() * 0.03;
  }

  draw(context: CanvasRenderingContext2D, screenW: number, screenH: number) {
    context.rotate((Math.PI * 1) / 10);

    // Save the context
    context.save();

    // move into the middle of the canvas, just to make room
    context.translate(this.x, this.y);

    // Change the opacity
    if (this.opacity > 1) {
      this.factor = -1;
    } else if (this.opacity <= 0) {
      this.factor = 1;

      this.x = Math.round(Math.random() * screenW);
      this.y = Math.round(Math.random() * screenH);
    }

    this.opacity += this.increment * this.factor;

    context.beginPath();
    for (let i = 5; i--; ) {
      context.lineTo(0, this.length);
      context.translate(0, this.length);
      context.rotate((Math.PI * 2) / 10);
      context.lineTo(0, -this.length);
      context.translate(0, -this.length);
      context.rotate(-((Math.PI * 6) / 10));
    }
    context.lineTo(0, this.length);
    context.closePath();
    context.fillStyle = "rgba(255, 255, 200, " + this.opacity + ")";
    context.shadowBlur = 5;
    context.shadowColor = "#ffff33";
    context.fill();

    context.restore();
  }
}
