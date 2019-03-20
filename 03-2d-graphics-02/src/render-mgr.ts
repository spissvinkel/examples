import * as mat3 from '@spissvinkel/maths/mat3';
import * as vec2 from '@spissvinkel/maths/vec2';

import { getScene } from './scene/scene-mgr';

const viewportSize = { width: 0, height: 0 };
const viewportMx = mat3.id();

const vp = mat3.id();
const mvp = mat3.id();
const tmpPoint = vec2.zero();

export const render: (context: CanvasRenderingContext2D) => void = context => {

  context.clearRect(0, 0, viewportSize.width, viewportSize.height);

  const { shapes, entities, camera } = getScene();

  mat3.mulMInto(viewportMx, camera.vp, vp);

  for (let i = 0; i < entities.length; i++) {

    const { drawable, m } = entities[i];
    if (drawable === undefined) continue;

    const { points } = shapes[drawable.shapeId];

    mat3.mulMInto(vp, m, mvp);

    context.beginPath();
    mat3.mulV2(mvp, points[0], tmpPoint);
    context.moveTo(tmpPoint.x, tmpPoint.y);
    for (let j = 1; j < points.length; j++) {
      mat3.mulV2(mvp, points[j], tmpPoint);
      context.lineTo(tmpPoint.x, tmpPoint.y);
    }
    context.closePath();

    const { fillStyle, lineStyle } = drawable;

    context.fillStyle = fillStyle;
    context.fill();

    context.strokeStyle = lineStyle;
    context.stroke();
  }
};

export const resize: (width: number, height: number) => void = (width, height) => {
  const wBy2 = width / 2, hBy2 = height / 2;
  viewportSize.width = width;
  viewportSize.height = height;
  mat3.set(viewportMx,
           wBy2,  0,     wBy2,
           0,    -hBy2,  hBy2,
           0,     0,     1);
};
