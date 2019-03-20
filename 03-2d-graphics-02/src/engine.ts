import * as RenderMgr from './render-mgr';
import * as SceneMgr from './scene/scene-mgr';

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

const doNextFrame: (timeMillis: number) => void = timeMillis => {
  const deltaTimeSeconds = (timeMillis - lastTimeMillis) * TIME_FACTOR;
  lastTimeMillis = timeMillis;
  SceneMgr.update(deltaTimeSeconds);
  RenderMgr.render(viewport.context);
  if (!runState.paused) window.requestAnimationFrame(doNextFrame);
};

const pause: () => void = () => {
  runState.paused = true;
  runState.statusElem.innerText = 'Paused';
};

const resume: () => void = () => {
  window.requestAnimationFrame(timeMillis => {
    lastTimeMillis = timeMillis;
    runState.paused = false;
    runState.statusElem.innerText = 'Running';
    window.requestAnimationFrame(doNextFrame);
  });
};

const togglePauseed: () => void = () => {
  if (runState.paused) resume();
  else pause();
};

const init: () => void = () => {
  initViewport();
  initRunState();
  resize();
  SceneMgr.init();
  window.addEventListener('resize', resize);
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

const resize: () => void = () => {
  resizeViewport();
  const { width, height, aspect } = viewport;
  SceneMgr.resize(aspect);
  RenderMgr.resize(width, height);
};

const resizeViewport: () => void = () => {
  const { wrapper: { clientWidth, clientHeight }, canvas } = viewport;
  canvas.width = clientWidth;
  canvas.height = clientHeight;
  viewport.width = clientWidth;
  viewport.height = clientHeight;
  viewport.aspect = clientWidth / clientHeight;
};

window.addEventListener('load', init);
