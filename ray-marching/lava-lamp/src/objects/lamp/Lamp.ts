import { Group, Mesh, MeshPhongMaterial, Scene, SubtractiveBlending } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { LavaMaterial } from './lava-shader';

export class LavaLamp extends Group {
  constructor() {
    const loader = new GLTFLoader();
    super();
    this.name = 'shiba';
    loader.load('/groovy_lava_lamp/scene.gltf', (gltf) => {
      Object.values(gltf.scene.children[0].children[0].children).forEach( (obj) => {
        if(!obj.name.includes('glob') && !obj.name.includes('glass')) {
          const mesh = obj.children[0] as Mesh;
          mesh.material = new MeshPhongMaterial( { color: 0xccccccc } )
          this.add(obj);
          return;
        }
        if(obj.name.includes('glass')) {
          const mesh = obj.children[0] as Mesh;
          mesh.material = LavaMaterial;
          this.add(obj);
          return;
        }
      })
    })
  }
}