import { Object3D } from "three";
import { earthOrbit } from "./earth";
import { sun } from "./sun";

export const solarSystem = new Object3D();
solarSystem.add(sun);
earthOrbit.position.x = 20;
solarSystem.add(earthOrbit);