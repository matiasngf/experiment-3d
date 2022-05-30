import { PerspectiveCamera } from "three";
import { EngineScene } from "./engine-scene";

export class EmptyScene extends EngineScene {
  constructor() {
    const defaultCamera = new PerspectiveCamera()
    super(defaultCamera);
  }
}