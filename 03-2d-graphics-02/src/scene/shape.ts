import { Vec2 } from '@spissvinkel/maths';

export interface Shape {
  id    : string;
  points: Vec2[];
}

export const mkShape: (id: string, points: Vec2[]) => Shape = (id, points) => ({ id, points });
