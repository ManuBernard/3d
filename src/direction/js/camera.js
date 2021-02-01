import * as THREE from "three";
import { scene } from "./scene.js";
import { sizes } from "./sizes.js";

export const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);

camera.position.z = 5;
camera.position.y = 2;

scene.add(camera);
