import { Vector3 } from "three";

// export const lightDirection = new Vector3(1, 0.5, 1);
export const lightDirection = new Vector3(1, 0, 0);
lightDirection.applyAxisAngle(new Vector3(0, 0, 1), Math.PI * (23 / 180));

const axis = new Vector3(0, 1, 0);
const angle = Math.PI * (-100 / 180);
lightDirection.applyAxisAngle(axis, angle);