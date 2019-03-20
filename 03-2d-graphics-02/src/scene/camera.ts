import { Mat3 } from '@spissvinkel/maths';
import * as mat3 from '@spissvinkel/maths/mat3';

import { Entity, mkEntity } from './entity';

export interface Camera extends Entity<Camera> {
  projection: Mat3;
  vp        : Mat3;
}

export const mkCamera: () => Camera = () => {
  const camera = mkEntity() as Camera;
  camera.projection = mat3.id();
  camera.vp = mat3.id();
  camera.clean = ({ projection, m, vp }) => { mat3.mulMInto(projection, m, vp); };
  return camera;
};

export const resizeCamera: (camera: Camera, width: number, height: number) => void = ({ projection }, w, h) => {
  mat3.set(projection,
           2 / w,  0.0,    0.0,
           0.0,    2 / h,  0.0,
           0.0,    0.0,    1.0);
};
