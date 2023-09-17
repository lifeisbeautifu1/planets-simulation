export interface Planet {
  x: number;
  y: number;
  m: number;
  vx: number;
  vy: number;
  energy: number;
}

export type SelectedMethod = "Euler" | "Euler-Kramer" | "Verlet" | "Beeman";

export type RenderingType = "planets" | "circles" | "circles with traces";
