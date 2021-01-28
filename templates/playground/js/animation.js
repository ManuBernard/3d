import * as THREE from "three";

import { scene } from "./scene.js";
import { controls } from "./controls.js";
import { renderer } from "./renderer.js";
import { camera } from "./camera.js";

// Array containing all animations
export const animations = [];

// Init clock
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Play animation
  animations.forEach((animation) => {
    animation(elapsedTime);
  });

  // Update controls
  controls.update();

  // Rerender the scene
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
