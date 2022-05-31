import { DirectionalLight, Euler, Matrix4, Mesh, PerspectiveCamera, Scene } from "three";
import { EngineScene } from "../../engine";
import { Earth } from "../../objects/earth";
import { SpaceAmbientLight } from "../../objects/space-ambient-light";
import { SunLight } from "../../objects/sun-light";

export class BackgroundScene extends Scene {
  activeCamera: PerspectiveCamera;
  earth: Mesh;
  sunLight: DirectionalLight;
  parentScene: EngineScene;

  constructor(parentScene: EngineScene) {
    super();
    this.parentScene = parentScene;
    this.activeCamera = new PerspectiveCamera();
    this.activeCamera.far = 100000;
    // this.position.z = 100;
    this.add(this.activeCamera);
    // this.background = new Color(0x0000FF);
    this.earth = Earth();
    this.add(this.earth);
    this.earth.position.z = -300;

    const sunLight = SunLight();
    this.sunLight = sunLight;
    this.sunLight.position.z = 10
    this.sunLight.position.x = 10
    this.add(this.sunLight);
    this.add(this.sunLight.target);

    this.add(SpaceAmbientLight());

    console.log('constructed');
  }

  onUpdate() {
    // TODO copy props from parent camara to currentCamera
    
    // make sure the matrix world is up to date
    const parentCamera = this.parentScene.activeCamera
    
    parentCamera.getWorldQuaternion(this.activeCamera.quaternion);
    // this.activeCamera.quaternion.copy(this.parentScene.activeCamera.quaternion);
    
    // this.activeCamera.rotation.set(
    //   this.parentScene.activeCamera.rotation.x,
    //   this.parentScene.activeCamera.rotation.y,
    //   this.parentScene.activeCamera.rotation.z
    // )
    this.earth.rotation.y += 0.0001;
  }

}