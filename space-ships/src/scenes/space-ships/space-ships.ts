import { CubeTextureLoader, DirectionalLight, Mesh, PerspectiveCamera, Scene, TextureLoader, Vector3, WebGLCubeRenderTarget } from 'three'
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
  }

  public onStart = () => {
    const loader = new TextureLoader();
    const texture = loader.load('/textures/2k_stars_milky_way.jpeg', () => {
      const rt = new WebGLCubeRenderTarget(texture.image.height);
      const engine = this.getEngine();
      rt.fromEquirectangularTexture(engine.renderer, texture);
      this.background = rt.texture;
    });
    this.spawnPlayerShip();
  }

  private spawnPlayerShip = () => {
    this.playerShip = new SpaceShip();
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