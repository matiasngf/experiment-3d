import { DirectionalLight, Mesh, PerspectiveCamera, Scene, Vector3 } from 'three'
import { EngineScene } from '../../engine'
import { Earth } from './objects/earth';
import { SpaceAmbientLight } from './objects/space-ambient-light';
import { SunLight } from './objects/sun-light';

export class SpaceShipsScene extends EngineScene {
  earth: Mesh;
  sunLight: DirectionalLight;

  constructor() {
    const InitialCamera = new PerspectiveCamera();
    InitialCamera.position.x = 10
    InitialCamera.lookAt(new Vector3(0,0,0));

    super(InitialCamera);

    // add objects
    this.add(SpaceAmbientLight());
    this.earth = Earth();
    this.add(this.earth);
    const sunLight = SunLight();
    this.sunLight = sunLight;
    this.sunLight.position.z = 10
    this.sunLight.position.x = 10
    this.add(this.sunLight);
    this.add(this.sunLight.target);
  }

  public onUpdate = (time: number): void => {
    this.earth.rotation.y += 0.01;
  }

}