import { WebGLRenderer, PerspectiveCamera, Scene, Vector3, AmbientLight, DirectionalLight } from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ground } from './ground';
import { cube } from './cube';
import { AlienSphere } from './alien-sphere';
import { PhongSphere } from './phong-sphere';

// scene
const scene = new Scene();
scene.add( ground );
ground.position.y = -2;
// this one has shader
// scene.add( AlienSphere );
scene.add( PhongSphere);

// renderer
const renderer = new WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x7ec0ee, 1);
renderer.shadowMap.enabled = true;

// lights
const ambientLight = new AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const directionalLight = new DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
directionalLight.target.position.set(0, 0, 0);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
scene.add(directionalLight);
scene.add(directionalLight.target);

// camera
const camera = new PerspectiveCamera();
camera.position.set(6,3,-7);
const controls = new OrbitControls( camera, renderer.domElement );
controls.update();

// render loop
const onAnimationFrameHandler = (timeStamp: number) => {
  // update the time uniform of the shader
  AlienSphere.material.uniforms.time.value = timeStamp / 1000;
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