import * as THREE from "three";
import { canvas } from "./canvas.js";
import { sizes } from "./sizes.js";

export const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
