import { Vec2, Vec4 } from '@spissvinkel/maths';
import * as vec2 from '@spissvinkel/maths/vec2';
import * as vec4 from '@spissvinkel/maths/vec4';

export interface Shape {
  points: Vec2[];
  size: Vec2;
  position: Vec2;
  velocity: Vec2;
  lineStyle: string;
  fillStyle: string;
}

const PADDING = 5;

const viewportMax = vec2.zero();
const shapes: Shape[] = [];

export const update: (deltaTimeSeconds: number) => Shape[] = deltaTimeSeconds => {
  for (let i = 0; i < shapes.length; i++) {
    updateShape(shapes[i], deltaTimeSeconds);
  }
  return shapes;
};

const updateShape: (shape: Shape, deltaTimeSeconds: number) => void = (shape, deltaTimeSeconds) => {
  vec2.addMul(shape.position, shape.velocity, deltaTimeSeconds);
  const max = vec2.subVInto(viewportMax, shape.size, vec2.zero());
  if (shape.position.x > max.x) {
    shape.position.x = max.x;
    shape.velocity.x *= -1;
  } else if (shape.position.x < PADDING) {
    shape.position.x = PADDING;
    shape.velocity.x *= -1;
  }
  if (shape.position.y > max.y) {
    shape.position.y = max.y;
    shape.velocity.y *= -1;
  } else if (shape.position.y < PADDING) {
    shape.position.y = PADDING;
    shape.velocity.y *= -1;
  }
};

export const resize: (width: number, height: number) => void = (w, h) => {
  vec2.set(viewportMax, w - PADDING, h - PADDING);
};

export const init: () => void = () => {
  const points = [
    vec2.of(  0,   0),
    vec2.of(  0, 100),
    vec2.of( 25, 100),
    vec2.of( 30,  90),
    vec2.of( 70,  90),
    vec2.of( 75, 100),
    vec2.of(100, 100),
    vec2.of(100,   0)
  ];
  const size = calculateSize(points);
  shapes[0] = {
    points,
    size,
    position: vec2.of(PADDING, PADDING),
    velocity: randomVelocity(),
    lineStyle: rgbaStyle(vec4.of(255, 175, 0, 1.0)),
    fillStyle: rgbaStyle(vec4.of(255, 255, 0, 0.75))
  };
  shapes[1] = {
    points,
    size,
    position: vec2.of(PADDING * 2, PADDING * 3),
    velocity: randomVelocity(),
    lineStyle: rgbaStyle(vec4.of(0, 175, 255, 1.0)),
    fillStyle: rgbaStyle(vec4.of(0, 255, 255, 0.75))
  };
};

const calculateSize: (points: Vec2[]) => Vec2 = points => {
  let xMin = Number.MAX_VALUE, xMax = Number.MIN_VALUE, yMin = Number.MAX_VALUE, yMax = Number.MIN_VALUE;
  for (let i = 0; i < points.length; i++) {
    const { x, y } = points[i];
    xMin = Math.min(xMin, x);
    xMax = Math.max(xMax, x);
    yMin = Math.min(yMin, y);
    yMax = Math.max(yMax, y);
  }
  return vec2.of(xMax - xMin, yMax - yMin);
};

const randomVelocity: () => Vec2 = () => vec2.of(randomPixelsPerSecond(), randomPixelsPerSecond());

const randomPixelsPerSecond: () => number = () => Math.random() * 125 + 50;

const rgbaStyle: (colour: Vec4) => string = ({ x, y, z, w }) => `rgba(${x}, ${y}, ${z}, ${w})`;
