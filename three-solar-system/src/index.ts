import { AxesHelper, Mesh, Object3D } from "three";
import { OnAnimationFrame, setup } from "./setup";
import GUI from "lil-gui";
// Objects
import { centerLight } from "./objects/centerLight";
import { solarSystem } from "./objects/solar-system";
import { sun } from "./objects/sun";
import { earth, earthOrbit } from "./objects/earth";
import { moon, moonOrbit } from "./objects/moon";
import { AxisGridHelper } from "./objects/axis-grid-helper";

const rotateMesh = (node: Mesh | Object3D, speed: number) => {
  node.rotation.y += speed;
}

const gui = new GUI();

const makeAxisGrid = (node: Mesh | Object3D, label: string, units?: number) => {
  const helper = new AxisGridHelper(node, units);
  gui.add(helper, 'visible').name(label);
}

setup({
  withOrbitControls: true,
  onInit: ({ scene, camera }) => {
    const axesHelper = new AxesHelper( 5 );
    gui.add(axesHelper, 'visible').name('Global Axes');
    scene.add( axesHelper );
    const cameraDistance = 15;
    camera.position.set(cameraDistance,cameraDistance,cameraDistance * 3);
    scene.add(centerLight);
    scene.add(solarSystem);

    makeAxisGrid(solarSystem, 'Solar System Orbit', 60);
    makeAxisGrid(earthOrbit, 'Earth Orbit', 10);
    makeAxisGrid(moonOrbit, 'Moon Orbit', 2);

    const onAnimationFrame: OnAnimationFrame = ({ timeStamp }) => {
      rotateMesh(solarSystem, 0.001);
      rotateMesh(sun, 0.01);
      rotateMesh(earthOrbit, 0.02);
      rotateMesh(earth, 0.01);
      rotateMesh(moonOrbit, 0.01);
      rotateMesh(moon, 0.01);
    }
    return onAnimationFrame;
  },
})