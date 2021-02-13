import * as THREE from "three";

import { scene } from "./scene.js";
import { renderer } from "./renderer.js";
import { camera } from "./camera.js";

// Array containing all animations
export const animations = [];

// Init clock
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Play animation
  animations.forEach((animation) => {
    animation(elapsedTime, deltaTime);
  });

  // Rerender the scene
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
