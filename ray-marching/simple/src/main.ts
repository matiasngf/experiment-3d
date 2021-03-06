import './style.css'
import { WebGLRenderer, PerspectiveCamera, Scene, Vector2, Vector3, GridHelper, Quaternion } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { RayMarchingShader } from './shaders/ray-marching';
import { GameCamera, Player } from './objects';

// scene
const scene = new Scene();

// renderer
const renderer = new WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 1);
renderer.shadowMap.enabled = true;

// camera
const player = new Player();
scene.add(player);
const camera = player.camera;
camera.fov = 30;

// add grid helper
const gridHelper = new GridHelper(50, 50);
scene.add(gridHelper);

//composer
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
const rayMarchingPass = new ShaderPass({
  ...RayMarchingShader,
  uniforms: {
    cPos: { value: camera.position.clone() },
    resolution: {value: new Vector2(window.innerWidth, window.innerHeight)},
    cameraQuaternion: {value: camera.quaternion.clone()},
    fov: {value: camera.fov}
  }
});
composer.addPass(rayMarchingPass);

// render loop
const onAnimationFrameHandler = (_timeStamp: number) => {

  player.onFrame();

  // update the time uniform of the shader
  rayMarchingPass.uniforms.resolution.value.set( innerWidth, innerHeight );
  const worldPos = new Vector3();
  rayMarchingPass.uniforms.cPos.value.copy(camera.getWorldPosition(worldPos));
  const cameraQuaternion = new Quaternion();
  rayMarchingPass.uniforms.cameraQuaternion.value.copy(camera.getWorldQuaternion(cameraQuaternion));
  rayMarchingPass.uniforms.fov.value = camera.fov;
  composer.render();
  window.requestAnimationFrame(onAnimationFrameHandler);
}
window.requestAnimationFrame(onAnimationFrameHandler);

// resize
const windowResizeHanlder = () => { 
  const { innerHeight, innerWidth } = window;
  renderer.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();

  rayMarchingPass.uniforms.resolution.value.set( innerWidth, innerHeight );
};
windowResizeHanlder();
window.addEventListener('resize', windowResizeHanlder);

const app = document.querySelector<HTMLDivElement>('#app')!
app.appendChild( renderer.domElement );
