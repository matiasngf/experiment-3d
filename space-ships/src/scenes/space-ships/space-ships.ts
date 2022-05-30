import { CubeTextureLoader, DirectionalLight, Mesh, PerspectiveCamera, Scene, Vector3 } from 'three'
import { Engine, EngineScene } from '../../engine'
import { Earth } from '../../objects/earth';
import { SpaceAmbientLight } from '../../objects/space-ambient-light';
import { SpaceShip } from '../../objects/space-ship';
import { SunLight } from '../../objects/sun-light';

export class SpaceShipsScene extends EngineScene {
  earth: Mesh;
  sunLight: DirectionalLight;
  playerShip?: SpaceShip;

  private shipRotation = 0.01

  constructor() {
    
    super();
    // add objects
    this.add(SpaceAmbientLight());

    this.earth = Earth();
    this.add(this.earth);
    this.earth.position.z = -3000;

    const sunLight = SunLight();
    this.sunLight = sunLight;
    this.sunLight.position.z = 10
    this.sunLight.position.x = 10
    this.add(this.sunLight);
    this.add(this.sunLight.target);

    const loader = new CubeTextureLoader();
    const texture = loader.load([
      '/textures/sky/right.png',
      '/textures/sky/left.png',
      '/textures/sky/top.png',
      '/textures/sky/bottom.png',
      '/textures/sky/front.png',
      '/textures/sky/back.png',
      // '/textures/sky/back.png',
      // '/textures/sky/top.png',
      // '/textures/sky/bottom.png',
      // '/textures/sky/right.png',
      // '/textures/sky/left.png',
    ]);
    this.background = texture;
  }

  public onStart = () => {
    this.spawnPlayerShip();
  }

  private spawnPlayerShip = () => {
    this.playerShip = new SpaceShip();
    // this.playerShip.rotation.y = 90;
    this.add(this.playerShip);
    this.setActiveCamera(this.playerShip.camera);
  }

  public onUpdate = (time: number): void => {
    if(!this.started || !this.engine || this.ended) {
      return;
    }
    this.earth.rotation.y += 0.001;

    if(this.playerShip) {
      if(this.isCodePressed('ArrowUp')) {
        this.playerShip.rotateX(-this.shipRotation);
      }
      if(this.isCodePressed('ArrowDown')) {
        this.playerShip.rotateX(this.shipRotation);
      }
      if(this.isCodePressed('ArrowLeft')) {
        this.playerShip.rotateZ(this.shipRotation * 2);
      }
      if(this.isCodePressed('ArrowRight')) {
        this.playerShip.rotateZ(-this.shipRotation * 2);
      }
      if(this.isCodePressed(' ')) {
        this.playerShip.translateZ(-2);
      } else {
        this.playerShip.translateZ(-1);
      }
    }    

  }

}