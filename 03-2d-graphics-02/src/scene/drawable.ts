import { Vec4 } from '@spissvinkel/maths';

export interface Drawable {
  shapeId   : string;
  lineColour: Vec4;
  fillColour: Vec4;
  dirty     : boolean;
  lineStyle : string;
  fillStyle : string;
}

export const mkDrawable: (shapeId: string, lineColour: Vec4, fillColour: Vec4) => Drawable
= (shapeId, lineColour, fillColour) => ({
  shapeId,
  lineColour,
  fillColour,
  dirty      : false,
  lineStyle  : rgbaStyle(lineColour),
  fillStyle  : rgbaStyle(fillColour)
});

export const cleanDrawable: (drawable: Drawable) => void = drawable => {
  const { lineColour, fillColour } = drawable;
  drawable.lineStyle = rgbaStyle(lineColour);
  drawable.fillStyle = rgbaStyle(fillColour);
  drawable.dirty = false;
};

const rgbaStyle: (colour: Vec4) => string = ({ x, y, z, w }) => `rgba(${x}, ${y}, ${z}, ${w})`;
