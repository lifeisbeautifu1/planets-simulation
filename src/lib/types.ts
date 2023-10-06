export interface Planet {
  x: number;
  y: number;
  m0: number;
  m: number;
  vx: number;
  vy: number;
  energy: number;
  q: number;
  B: number;
}

export type SelectedMethod = "Euler" | "Euler-Kramer" | "Verlet" | "Beeman";

export type RenderingType = "planets" | "circles" | "circles with traces";
