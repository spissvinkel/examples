import { Mat2, Mat3, Vec2 } from '@spissvinkel/maths';
import * as mat2 from '@spissvinkel/maths/mat2';
import * as mat3 from '@spissvinkel/maths/mat3';
import * as vec2 from '@spissvinkel/maths/vec2';

import { cleanDrawable, Drawable } from './drawable';
import { Moveable, updateMoveable } from './moveable';

export interface BaseEntity {
  position   : Vec2;
  scale      : Vec2;
  orientation: number;
  dirty      : boolean;
  m          : Mat3;
  rotM2      : Mat2;
  moveable?  : Moveable;
  drawable?  : Drawable;
}

export interface EntityUpdateFn<E extends Entity<E>> { (entity: E, deltaTimeSeconds: number): void }
export interface EntityCleanFn<E extends Entity<E>> { (entity: E): void }

export interface Entity<E extends Entity<E>> extends BaseEntity {
  update?: EntityUpdateFn<E>;
  clean? : EntityCleanFn<E>;
}

export const mkEntity: () => Entity<BaseEntity> = () => ({
  position   : vec2.zero(),
  scale      : vec2.one(),
  orientation: 0.0,
  dirty      : true,
  m          : mat3.id(),
  rotM2      : mat2.id()
});

export const updateEntity: EntityUpdateFn<Entity<BaseEntity>> = (entity, deltaTimeSeconds) => {
  const { moveable, update } = entity;
  if (moveable !== undefined) updateMoveable(moveable, deltaTimeSeconds);
  if (update !== undefined) update(entity, deltaTimeSeconds);
};

export const cleanEntity: EntityCleanFn<Entity<BaseEntity>> = entity => {
  const { position, scale, orientation, m, rotM2, drawable, clean } = entity;
  mat3.mulM2(mat3.setScaleTrsl(m, scale, position), mat2.setRot(rotM2, orientation));
  if (clean !== undefined) clean(entity);
  if (drawable !== undefined && drawable.dirty) cleanDrawable(drawable);
  entity.dirty = false;
};
