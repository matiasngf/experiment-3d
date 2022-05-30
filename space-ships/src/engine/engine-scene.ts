import { Camera, Scene } from "three";

export abstract class EngineScene extends Scene {
  
  activeCamera: Camera;
  onUpdate?: (time: number) => void;

  constructor(camera: Camera) {
    super()
    this.activeCamera = camera;
  }

  public _onUpdate = (time: number) => {
    if( typeof this.onUpdate === 'function') {
      this.onUpdate(time);
    }
  }
}