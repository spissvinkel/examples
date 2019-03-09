import { Viewport } from './engine';
import { Shape } from './scene-mgr';

const fillStyle = 'rgba(255, 255, 0, 0.5)';
const lineStyle = 'rgba(255, 175, 0, 1.0)';

export const render: (viewport: Viewport, shape: Shape) => void = (viewport, shape) => {
  const { context, width, height } = viewport;
  context.clearRect(0, 0, width, height);
  const { x, y, w, h } = shape;
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x, y + h);
  context.lineTo(x + w, y + h);
  context.lineTo(x + w, y);
  context.closePath();
  context.fillStyle = fillStyle;
  context.fill();
  context.strokeStyle = lineStyle;
  context.stroke();
};
