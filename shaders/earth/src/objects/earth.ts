import { Mesh, SphereGeometry } from "three";
import { EarthMaterial } from "../materials/earth";

const verteces = Math.pow(2, 9);

export const Earth = new Mesh(
  new SphereGeometry(2, verteces, verteces),
  EarthMaterial
)