import { LinearMipMapLinearFilter, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, SphereGeometry, TextureLoader } from "three";

const textureLoader = new TextureLoader();
const earthDaymap = textureLoader.load('/textures/earth/2k_earth_daymap.jpg');
earthDaymap.minFilter = LinearMipMapLinearFilter;
const earthSpecular = textureLoader.load('/textures/earth/2k_earth_specular_map.jpg');
const earthSpecularInverted = textureLoader.load('/textures/earth/2k_earth_specular_map_inverted.jpg');

const earthGeometry = new SphereGeometry(300, 32, 32);
const earthMaterial = new MeshPhysicalMaterial({
  map: earthDaymap,
  metalnessMap: earthSpecular,
  roughnessMap: earthSpecularInverted,
});

export const Earth = () => {
  const earth = new Mesh(earthGeometry, earthMaterial);
  earth.castShadow = true;
  earth.receiveShadow = true;
  earth.scale.y = 0.9;
  return earth;
}