import { Engine } from "./engine";
import { SpaceShipsScene } from "./scenes/space-ships";

const engine = new Engine({
  document
});

engine.start();

document.body.style.margin = '0';
document.body.appendChild( engine.renderer.domElement );

const SpaceScene = new SpaceShipsScene();

engine.setScene(SpaceScene);