import { Mesh, SphereGeometry } from "three";
import { MetalCorroedMaterial } from "../materials/metal-corroded-heavy";

export const MetalSphere = new Mesh(
  new SphereGeometry(2, 32, 32),
  MetalCorroedMaterial
)