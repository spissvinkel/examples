import { Vec2, Vec4 } from '@spissvinkel/maths';
import * as vec2 from '@spissvinkel/maths/vec2';
import * as vec4 from '@spissvinkel/maths/vec4';

export interface Shape {
  points: Vec2[];
  size: Vec2;
  lineColour: Vec4;
  fillColour: Vec4;
  position: Vec2;
  velocity: Vec2;
}

const PADDING = 5;

const shapes: Shape[] = [];
const viewportSize = vec2.zero();

const updateShape: (shape: Shape, deltaTimeSeconds: number) => void = (shape, deltaTimeSeconds) => {
  vec2.addMul(shape.position, shape.velocity, deltaTimeSeconds);
  const maxX = viewportSize.x - PADDING - shape.size.x;
  if (shape.position.x > maxX) {
    shape.position.x = maxX;
    shape.velocity.x *= -1;
  } else if (shape.position.x < PADDING) {
    shape.position.x = PADDING;
    shape.velocity.x *= -1;
  }
  const maxY = viewportSize.y - PADDING - shape.size.y;
  if (shape.position.y > maxY) {
    shape.position.y = maxY;
    shape.velocity.y *= -1;
  } else if (shape.position.y < PADDING) {
    shape.position.y = PADDING;
    shape.velocity.y *= -1;
  }
};

export const resizeScene: (width: number, height: number, aspect: number) => void = (w, h, a) => {
  vec2.set(viewportSize, w, h);
};

export const updateScene: (deltaTimeSeconds: number) => Shape[] = deltaTimeSeconds => {
  for (let i = 0; i < shapes.length; i++) {
    updateShape(shapes[i], deltaTimeSeconds);
  }
  return shapes;
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

const randomSpeed: () => number = () => Math.random() * 150 - 50;

const randomVelocity: () => Vec2 = () => vec2.of(randomSpeed(), randomSpeed());

export const initScene: () => void = () => {
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
    lineColour: vec4.of(255, 175, 0, 1.0),
    fillColour: vec4.of(255, 255, 0, 0.75),
    position: vec2.of(PADDING, PADDING),
    velocity: randomVelocity()
  };
  shapes[1] = {
    points,
    size,
    lineColour: vec4.of(0, 175, 255, 1.0),
    fillColour: vec4.of(0, 255, 255, 0.75),
    position: vec2.of(PADDING * 2, PADDING * 3),
    velocity: randomVelocity()
  };
};
