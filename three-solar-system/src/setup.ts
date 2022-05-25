import { WebGLRenderer, PerspectiveCamera, Scene, Vector3, OrthographicCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export type SetCurrentCamera = (camera: PerspectiveCamera) => void;

export type OnAnimationFrame = (options: {timeStamp: number}) => void;
export type OnInit = (options: {
  scene: Scene,
  camera: PerspectiveCamera,
  renderer: WebGLRenderer,
  setCurrentCamera: SetCurrentCamera
}) => OnAnimationFrame | void;

export interface Options {
  onInit?: OnInit;
  withOrbitControls?: boolean;
}

export const setup = ({
  onInit,
  withOrbitControls,
}: Options): void => {
    // scene
    const scene = new Scene();
    
    // renderer
    const renderer = new WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 1);
    
    // camera
    const camera = new PerspectiveCamera();
    camera.lookAt(new Vector3(0,0,0));
    
    let currentCamera: PerspectiveCamera = camera;
    const setCurrentCamera: SetCurrentCamera = (camera) => {
      currentCamera = camera;
      if(windowResizeHanlder) {
        windowResizeHanlder();
      }
    }
    
    // user defined init
    let onAnimationFrame: OnAnimationFrame | null = null;
    if (onInit) {
      const returnedInit = onInit({scene, camera, renderer, setCurrentCamera});
      if(returnedInit) {
        onAnimationFrame = returnedInit;
      }
    };
    if(withOrbitControls) {
      const controls = new OrbitControls( camera, renderer.domElement );
      controls.update();
    }
    
    // render loop
    const onAnimationFrameHandler = (timeStamp: number) => {
      onAnimationFrame && onAnimationFrame({timeStamp});
      renderer.render(scene, currentCamera);
      window.requestAnimationFrame(onAnimationFrameHandler);
    }
    window.requestAnimationFrame(onAnimationFrameHandler);
    
    // resize
    const windowResizeHanlder = () => { 
      const { innerHeight, innerWidth } = window;
      renderer.setSize(innerWidth, innerHeight);
      currentCamera.aspect = innerWidth / innerHeight;
      currentCamera.updateProjectionMatrix();
    };
    windowResizeHanlder();
    window.addEventListener('resize', windowResizeHanlder);
    
    // dom
    document.body.style.margin = '0';
    document.body.appendChild( renderer.domElement );
}