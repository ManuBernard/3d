import * as THREE from "three";

import { textureLoader } from "../js/textureLoader.js";
import { scene } from "../js/scene.js";
import { renderer } from "../js/renderer.js";

export default class level {
  constructor(element, options) {
    this._clean();
    console.log("CLASS LEVEL HELLO");
  }

  _clean() {
    renderer.dispose();

    const cleanMaterial = (material) => {
      console.log("dispose material!");
      material.dispose();

      // dispose textures
      for (const key of Object.keys(material)) {
        const value = material[key];
        if (value && typeof value === "object" && "minFilter" in value) {
          console.log("dispose texture!");
          value.dispose();
        }
      }
    };

    scene.traverse((object) => {
      if (!object.isMesh) return;

      console.log("dispose geometry!");
      object.geometry.dispose();

      if (object.material.isMaterial) {
        cleanMaterial(object.material);
      } else {
        // an array of materials
        for (const material of object.material) cleanMaterial(material);
      }

      scene.remove(object);
    });
  }
}
