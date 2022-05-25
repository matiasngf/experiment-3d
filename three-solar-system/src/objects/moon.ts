import { Mesh, MeshPhongMaterial, Object3D, PerspectiveCamera, SphereGeometry, Vector3 } from "three";

const moonGeometry = new SphereGeometry(0.2, 32, 32);
const moonMaterial = new MeshPhongMaterial({color: 0x888888, emissive: 0x222222});
export const moon = new Mesh(moonGeometry, moonMaterial);
export const moonOrbit = new Object3D();
moonOrbit.add(moon);

export const moonCamera = new PerspectiveCamera();
moon.add(moonCamera);
moonCamera.position.x = 5;
moonCamera.position.y = 2;
moonCamera.lookAt(new Vector3(0,0,0));