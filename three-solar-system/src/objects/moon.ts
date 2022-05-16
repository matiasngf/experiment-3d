import { Mesh, MeshPhongMaterial, Object3D, SphereGeometry } from "three";

const moonGeometry = new SphereGeometry(0.2, 32, 32);
const moonMaterial = new MeshPhongMaterial({color: 0x888888, emissive: 0x222222});
export const moon = new Mesh(moonGeometry, moonMaterial);
export const moonOrbit = new Object3D();
moonOrbit.add(moon);