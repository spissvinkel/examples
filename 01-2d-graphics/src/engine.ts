import { initRenderer, render } from './renderer';
import { initScene, resizeScene, updateScene } from './scene';
import { gauss } from '@spissvinkel/maths/maths';

export interface Viewport {
  wrapper: HTMLElement;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  aspect: number;
}

interface RunState {
  paused: boolean;
  button: HTMLButtonElement;
  statusElem: HTMLElement;
}

const TIME_FACTOR = 1 / 1000; // Millisecond resolution

let viewport: Viewport;
let runState: RunState;
let lastTimeMillis = 0;

const updateTime: (timeMillis: number) => void = timeMillis => {
  lastTimeMillis = timeMillis;
}

const calculateNextDeltaTime: (timeMillis: number) => number = timeMillis => {
  const deltaTimeSeconds = (timeMillis - lastTimeMillis) * TIME_FACTOR;
  updateTime(timeMillis);
  return deltaTimeSeconds;
}

const doNextFrame: (timeMillis: number) => void = timeMillis => {
  const deltaTimeSeconds = calculateNextDeltaTime(timeMillis);
  const shapes = updateScene(deltaTimeSeconds);
  render(viewport, shapes);
  if (!runState.paused) window.requestAnimationFrame(doNextFrame);
};

const pause: () => void = () => {
  runState.paused = true;
  runState.statusElem.innerText = 'Paused';
};

const resume: () => void = () => {
  window.requestAnimationFrame(updateTime);
  runState.paused = false;
  runState.statusElem.innerText = 'Running';
  window.requestAnimationFrame(doNextFrame);
};

const togglePauseed: () => void = () => {
  if (runState.paused) resume();
  else pause();
};

const resize: () => void = () => {
  const { wrapper, canvas } = viewport;
  viewport.width = wrapper.offsetWidth;
  viewport.height = wrapper.offsetHeight;
  viewport.aspect = viewport.width / viewport.height;
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  resizeScene(viewport.width, viewport.height, viewport.aspect);
};

const initViewport: () => void = () => {
  const wrapper = document.getElementById('wrapper') as HTMLElement;
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const context = canvas.getContext('2d');
  if (!context) throw '2d context unavailable';
  viewport = { wrapper, canvas, context, width: 0, height: 0, aspect: 1.0 };
};

const initRunState: () => void = () => {
  const button = document.getElementById('play-pause-btn') as HTMLButtonElement;
  const statusElem = document.getElementById('paused-status') as HTMLElement;
  button.addEventListener('click', togglePauseed);
  runState = { paused: true, button, statusElem };
};

export const initEngine: () => void = () => {
  initViewport();
  initRunState();
  initScene();
  initRenderer();
  resize();
  window.addEventListener('resize', resize);

  console.log(`gauss(1.2, 0) = ${gauss(1.2, 0)}`);
};
