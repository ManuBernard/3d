import * as THREE from "three";

import imageSource from "../textures/3.png";
import level from "./level";

import { textureLoader } from "../js/textureLoader.js";
import { scene } from "../js/scene.js";

import loadLevel from "../js/loadLevel.js";

const matcapTexture = textureLoader.load(imageSource);

export default class level1 extends level {
  constructor(element, options) {
    console.log("CLASS 1 HELLO");
    super();

    this.build();

    window.setTimeout(() => {
      loadLevel("level3");
    }, 3000);
  }

  build() {
    const cube = new THREE.Mesh(
      new THREE.BoxBufferGeometry(2, 8, 1),
      new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
    );

    scene.add(cube);
  }
}
