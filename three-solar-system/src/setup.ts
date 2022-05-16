import { WebGLRenderer, PerspectiveCamera, Scene, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export type OnAnimationFrame = (options: {timeStamp: number}) => void;
export type OnInit = (options: {scene: Scene, camera: PerspectiveCamera, renderer: WebGLRenderer}) => OnAnimationFrame | void;

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
    
    // user defined init
    let onAnimationFrame: OnAnimationFrame | null = null;
    if (onInit) {
      const returnedInit = onInit({scene, camera, renderer});
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
}