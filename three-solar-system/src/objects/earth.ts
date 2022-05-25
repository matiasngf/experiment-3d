import { Mesh, MeshPhongMaterial, Object3D, PerspectiveCamera, SphereGeometry, Vector3 } from "three";
import { moonOrbit } from "./moon";

const earthGeometry = new SphereGeometry(0.5, 32, 32);
const earthMaterial = new MeshPhongMaterial({color: 0x2233FF, emissive: 0x102040});
export const earth = new Mesh(earthGeometry, earthMaterial);
export const earthOrbit = new Object3D();
earthOrbit.add(earth);
earthOrbit.add(moonOrbit);
moonOrbit.position.x = 2;

export const earthCamera = new PerspectiveCamera();
earth.add(earthCamera);
earthCamera.position.x = 5;
earthCamera.position.y = 2;
earthCamera.lookAt(new Vector3(0,0,0));