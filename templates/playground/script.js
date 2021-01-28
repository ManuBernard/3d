import "./style.css";
import * as THREE from "three";

import imageSource from "./textures/1.png";

import "./js/init.js";

import { textureLoader } from "./js/textureLoader.js";
import { scene } from "./js/scene.js";
import { animations } from "./js/animation.js";

const matcapTexture = textureLoader.load(imageSource);

/**
 * Objects
 */

const cube = new THREE.Mesh(
  new THREE.BoxBufferGeometry(1, 1, 1),
  new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
);

scene.add(cube);

// Set the animation
animations.push((elapsedTime) => {});
