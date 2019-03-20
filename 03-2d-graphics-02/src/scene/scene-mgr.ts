import { Vec2 } from '@spissvinkel/maths';
import * as Maths from '@spissvinkel/maths/maths';
import * as vec2 from '@spissvinkel/maths/vec2';
import * as vec4 from '@spissvinkel/maths/vec4';

import { Camera, mkCamera, resizeCamera } from './camera';
import { mkDrawable } from './drawable';
import { BaseEntity, cleanEntity, Entity, EntityUpdateFn, mkEntity, updateEntity } from './entity';
import { mkMoveable } from './moveable';
import { Shape, mkShape } from './shape';

export type Shapes = { [ id: string ]: Shape };

export interface Scene {
  shapes: Shapes;
  entities: BaseEntity[];
  camera: Camera;
}

const BLOCK_ID = 'block';
const SMALLEST_DIMENSION = 8.0; // meters

const viewportMin = vec2.zero();
const viewportMax = vec2.zero();

const scene: Scene = {
  shapes: { },
  entities: [ ],
  camera: mkCamera()
};

export const getScene: () => Scene = () => scene;

export const update: (deltaTimeSeconds: number) => void = deltaTimeSeconds => {
  const { entities } = scene;
  for (let i = 0; i < entities.length; i++) {
    updateEntity(entities[i], deltaTimeSeconds);
    cleanEntity(entities[i]);
  }
};

export const resize: (aspect: number) => void = aspect => {
  const width = aspect <= 1 ? SMALLEST_DIMENSION : SMALLEST_DIMENSION * aspect;
  const height = aspect >= 1 ? SMALLEST_DIMENSION : SMALLEST_DIMENSION / aspect;
  const wBy2 = width / 2, hBy2 = height / 2;
  vec2.set(viewportMin, -wBy2, -hBy2);
  vec2.set(viewportMax,  wBy2,  hBy2);
  resizeCamera(scene.camera, width, height);
};

export const init: () => void = () => {
  initShapes();
  initEntities();
  initCamera();
};

const initShapes: () => void = () => {
  // 1x1 meters
  const points = [
    vec2.of(-0.5 ,  0.5 ),
    vec2.of(-0.5 , -0.5 ),
    vec2.of(-0.25, -0.5 ),
    vec2.of(-0.2 , -0.4 ),
    vec2.of( 0.2 , -0.4 ),
    vec2.of( 0.25, -0.5 ),
    vec2.of( 0.5 , -0.5 ),
    vec2.of( 0.5 ,  0.5 )
  ];
  const shape = mkShape(BLOCK_ID, points);
  addShape(shape);
};

const initEntities: () => void = () => {
  const block1 = mkEntity()
  vec2.setV(block1.position, randomPosition());
  vec2.mul(block1.scale, 1.25); // scale up 25% to 1.25x1.25 meters
  block1.moveable = mkMoveable(block1, randomVelocity());
  block1.update = checkBounds;
  block1.drawable = mkDrawable(BLOCK_ID, vec4.of(255, 175, 0, 1.0), vec4.of(255, 255, 0, 0.75));
  addEntity(block1);

  const block2 = mkEntity()
  vec2.setV(block2.position, randomPosition());
  block2.orientation = Maths.deg2rad(-30); // rotate 30 degrees clockwise
  block2.moveable = mkMoveable(block2, randomVelocity());
  block2.update = checkBounds;
  block2.drawable = mkDrawable(BLOCK_ID, vec4.of(0, 175, 255, 1.0), vec4.of(0, 255, 255, 0.75));
  addEntity(block2);
};

const checkBounds: EntityUpdateFn<Entity<BaseEntity>> = entity => {
  const { x: minX, y: minY } = viewportMin;
  const { x: maxX, y: maxY } = viewportMax;

  if (entity.position.x > maxX) {
    entity.position.x = maxX;
    entity.moveable!.velocity.x *= -1;
  } else if (entity.position.x < minX) {
    entity.position.x = minX;
    entity.moveable!.velocity.x *= -1;
  }

  if (entity.position.y > maxY) {
    entity.position.y = maxY;
    entity.moveable!.velocity.y *= -1;
  } else if (entity.position.y < minY) {
    entity.position.y = minY;
    entity.moveable!.velocity.y *= -1;
  }
};

const randomPosition: () => Vec2
  = () => vec2.lerpE(viewportMin, viewportMax, Math.random(), Math.random(), vec2.zero());

const randomVelocity: () => Vec2 = () => vec2.of(randomMetersPerSecond(), randomMetersPerSecond());

const randomMetersPerSecond: () => number = () => (Math.random() * 1.25 + 0.75) * (Math.random() >= 0.5 ? 1 : -1);

const initCamera: () => void = () => {
  addEntity(scene.camera);
}

const addShape: (shape: Shape) => void = shape => {
  scene.shapes[shape.id] = shape;
};

const addEntity: (entity: BaseEntity) => void = entity => {
  scene.entities.push(entity);
}
