import { Vec4 } from '@spissvinkel/maths';
import * as vec2 from '@spissvinkel/maths/vec2';
import { Viewport } from './engine';
import { Shape } from './scene';

const rgbaStyle: (colour: Vec4) => string = ({ x, y, z, w }) => `rgba(${x}, ${y}, ${z}, ${w})`;

export const render: (viewport: Viewport, shapes: Shape[]) => void = (viewport, shapes) => {
  const { context, width, height } = viewport;
  context.clearRect(0, 0, width, height);
  const p = vec2.zero();
  for (let i = 0; i < shapes.length; i++) {
    const { points, position, fillColour, lineColour } = shapes[i];
    context.beginPath();
    vec2.addVInto(position, points[0], p);
    context.moveTo(p.x, p.y);
    for (let j = 1; j < points.length; j++) {
      vec2.addVInto(position, points[j], p);
      context.lineTo(p.x, p.y);
    }
    context.closePath();
    context.fillStyle = rgbaStyle(fillColour);
    context.fill();
    context.strokeStyle = rgbaStyle(lineColour);
    context.stroke();
  }
};

export const initRenderer: () => void = () => {
};
