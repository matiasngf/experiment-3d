import { Mesh, MeshPhongMaterial, SphereGeometry } from "three";

const sunGeometry = new SphereGeometry(1, 32, 32);
const sunMaterial = new MeshPhongMaterial({emissive: 0xffff00});
export const sun = new Mesh(sunGeometry, sunMaterial);