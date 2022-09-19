import './style.css'
import { WebGLRenderer, Scene, Vector2, Vector3, GridHelper, Quaternion, TextureLoader, RepeatWrapping, DirectionalLight, AmbientLight, PointLight } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { Player } from './objects';
import backgroundMapUrl from './textures/goegap_4k.jpg';
import { LavaLamp } from './objects/lamp';
import { ground } from './objects/Ground';

// scene
const scene = new Scene();

const lamp = new LavaLamp();
lamp.position.set(0, 0.93, 0);
scene.add(lamp);

scene.add(new AmbientLight(0xFFFFFF, 0.1))
const centerLight = new PointLight(0xFFFFFF, 1);
centerLight.position.set(0, 5, 0);
scene.add(centerLight);

scene.add(ground);


// renderer
const renderer = new WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 1);
renderer.shadowMap.enabled = true;

// camera
const player = new Player();
scene.add(player);
const camera = player.camera;
camera.fov = 50;
player.position.set(0, -1, 5);

// add grid helper
const gridHelper = new GridHelper(50, 50);
scene.add(gridHelper);

// background image
const backgroundTexture = new TextureLoader().load(backgroundMapUrl);
backgroundTexture.wrapT = backgroundTexture.wrapS = RepeatWrapping;

const getDeviceSize = () => {
  const {innerWidth, innerHeight, devicePixelRatio} = window;
  return {
    width: innerWidth * devicePixelRatio,
    height: innerHeight * devicePixelRatio
  }
}

const initDeviceSize = getDeviceSize();

//composer
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
// const rayMarchingPass = new ShaderPass({
//   ...RayMarchingShader,
//   uniforms: {
//     uTime: { value: 0 },
//     hdriMap: { value: backgroundTexture },
//     cPos: { value: camera.position.clone() },
//     resolution: {value: new Vector2(initDeviceSize.width, initDeviceSize.height)},
//     cameraQuaternion: {value: camera.quaternion.clone()},
//     fov: {value: camera.fov}
//   }
// });
// composer.addPass(rayMarchingPass);

// render loop
const onAnimationFrameHandler = (__timeStamp: number) => {

  player.onFrame();
  composer.render();
  window.requestAnimationFrame(onAnimationFrameHandler);
}
window.requestAnimationFrame(onAnimationFrameHandler);

// resize
const windowResizeHanlder = () => { 
  const deviceSize = getDeviceSize();
  
  const { innerHeight, innerWidth } = window;

  renderer.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
};
windowResizeHanlder();
window.addEventListener('resize', windowResizeHanlder);

const app = document.querySelector<HTMLDivElement>('#app')!
app.appendChild( renderer.domElement );
