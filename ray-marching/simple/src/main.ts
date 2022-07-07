import './style.css'
import { WebGLRenderer, PerspectiveCamera, Scene, Vector2, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { RayMarchingShader } from './shaders/ray-marching';

// scene
const scene = new Scene();

// renderer
const renderer = new WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 1);
renderer.shadowMap.enabled = true;

// camera
const camera = new PerspectiveCamera();
camera.position.set(0.0, 2.0, 0.0);
camera.rotation.x =  10 * Math.PI / 180

//composer
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
const rayMarchingPass = new ShaderPass({
  ...RayMarchingShader,
  uniforms: {
    cPos: { value: camera.position.clone() },
    resolution: {value: new Vector2(window.innerWidth, window.innerHeight)},
    cameraQuaternion: {value: camera.quaternion.clone()}
  }
});
composer.addPass(rayMarchingPass);

// render loop
const onAnimationFrameHandler = (timeStamp: number) => {

  // camera.rotateOnWorldAxis(new Vector3(0, 1, 0), 1 * Math.PI / 180);

  // update the time uniform of the shader
  rayMarchingPass.uniforms.resolution.value.set( innerWidth, innerHeight );
  rayMarchingPass.uniforms.cPos.value.copy(camera.position);
  rayMarchingPass.uniforms.cameraQuaternion.value.copy(camera.quaternion);
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
