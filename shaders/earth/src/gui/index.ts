import GUI from 'lil-gui'; 
import { Vector3 } from 'three';
import { lightDirection, originalLightDirection } from '../materials/globals';

export const gui = new GUI();

const data = {
  sunRotation: 0,
}

gui.add(data, 'sunRotation', 0, 360).onChange((value: number) => {
  lightDirection.copy(originalLightDirection)
  const axis = new Vector3(0, 1, 0);
  const angle = Math.PI * (value / 180);
  lightDirection.applyAxisAngle(axis, angle);
})