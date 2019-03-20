import { Vec2 } from '@spissvinkel/maths';
import * as vec2 from '@spissvinkel/maths/vec2';

import { BaseEntity } from './entity';

export interface Moveable {
  entity  : BaseEntity;
  velocity: Vec2;
}

export const mkMoveable: (entity: BaseEntity, velocity?: Vec2) => Moveable = (entity, velocity) => ({
  entity,
  velocity: velocity || vec2.zero()
});

export const updateMoveable: (moveable: Moveable, deltaTimeSeconds: number) => void = (moveable, deltaTimeSeconds) => {
  const { entity, velocity } = moveable;
  const { position } = entity;
  vec2.addMul(position, velocity, deltaTimeSeconds);
  entity.dirty = true;
};
