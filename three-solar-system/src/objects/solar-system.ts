import { Object3D, PerspectiveCamera, Vector3 } from "three";
import { earthOrbit } from "./earth";
import { sun } from "./sun";

export const solarSystem = new Object3D();
solarSystem.add(sun);
earthOrbit.position.x = 20;
solarSystem.add(earthOrbit);

export const solarSystemCamera = new PerspectiveCamera();
solarSystemCamera.position.x = 15;
solarSystemCamera.position.y = 15;
solarSystemCamera.position.z = 15 * 3;
solarSystemCamera.lookAt(new Vector3(0,0,0));