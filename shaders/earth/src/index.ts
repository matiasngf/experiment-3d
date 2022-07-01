import { WebGLRenderer, PerspectiveCamera, Scene } from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import './gui';
import { Earth } from './objects/earth';

// scene
const scene = new Scene();

scene.add(Earth);

// renderer
const renderer = new WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 1);
renderer.shadowMap.enabled = true;

// camera
const camera = new PerspectiveCamera(1);
const distance = 50;
camera.position.set(distance * 5, distance * 0.5, distance * 3);
const controls = new OrbitControls( camera, renderer.domElement );
controls.update();

// render loop
const onAnimationFrameHandler = (timeStamp: number) => {
  // update the time uniform of the shader
  renderer.render(scene, camera);
  window.requestAnimationFrame(onAnimationFrameHandler);
}
window.requestAnimationFrame(onAnimationFrameHandler);

// resize
const windowResizeHanlder = () => { 
  const { innerHeight, innerWidth } = window;
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
};
windowResizeHanlder();
window.addEventListener('resize', windowResizeHanlder);

// dom
document.body.style.margin = '0';
document.body.appendChild( renderer.domElement );