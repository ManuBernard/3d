import * as THREE from "three";

import { scene } from "./scene.js";
// import { controls } from "./controls.js";
import { renderer } from "./renderer.js";
import { camera } from "./camera.js";
import { player } from "./player.js";

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

  // Update controls
  // controls.update();
  if (camera.player) {
    camera.lookAt(camera.player._player.position);
    camera.position.z = camera.player._player.position.z + 18;
    camera.position.y = camera.player._player.position.y + 12;
    camera.position.x = camera.player._player.position.x;
  }

  // Rerender the scene
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
