import { Mesh, MeshPhongMaterial, SphereGeometry, TextureLoader } from "three";

const sunGeometry = new SphereGeometry(1, 32, 32);

const textureLoader = new TextureLoader();
const sunmap = textureLoader.load('/textures/sun/2k_sun.jpg');

const sunMaterial = new MeshPhongMaterial({
  emissive: 0xffffff,
  emissiveMap: sunmap,
});
export const sun = new Mesh(sunGeometry, sunMaterial);
