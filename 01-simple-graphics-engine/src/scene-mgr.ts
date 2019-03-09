export interface Shape {
  x: number;
  y: number;
  w: number;
  h: number;
}

const PADDING = 10;
const INTERVAL = 2; // seconds

const shape: Shape = { x: 0, y: 0, w: 0, h: 0 };

let timer = INTERVAL;
let shrink = true;

export const update: (deltaTimeSeconds: number) => Shape = deltaTimeSeconds => {
  timer -= deltaTimeSeconds;
  if (timer <= 0) {
    const dxy = PADDING * 4 * (shrink ? 1 : -1);
    const dwh = dxy * -2;
    shape.x += dxy;
    shape.y += dxy;
    shape.w += dwh;
    shape.h += dwh;
    shrink = !shrink;
    timer = INTERVAL;
  }
  return shape;
};

export const resize: (width: number, height: number) => void = (w, h) => {
  shape.x = PADDING;
  shape.y = PADDING;
  shape.w = w - PADDING * 2;
  shape.h = h - PADDING * 2;
  shrink = true;
  timer = INTERVAL;
};
