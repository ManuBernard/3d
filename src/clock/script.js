import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

/**
 * Base
 */

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */

const swissClock = new THREE.Group();

// Dial
const dial = new THREE.Mesh(
  new THREE.CylinderBufferGeometry(48, 48, 1, 60),
  new THREE.MeshBasicMaterial({
    color: 0xffffff,
  })
);

dial.position.y = 0;
swissClock.add(dial);

// Clock ticks
for (let i = 0; i < 60; i++) {
  let tickSize;

  if (i == 0) {
    tickSize = {
      width: 14,
      height: 3,
      position: 38,
    };
  } else if (i % 5 == 0) {
    tickSize = {
      width: 8,
      height: 2.5,
      position: 40,
    };
    console.log(i);
  } else {
    tickSize = {
      width: 4,
      height: 1,
      position: 42,
    };
  }

  const clockTick = new THREE.Mesh(
    new THREE.BoxGeometry(tickSize.width, 1, tickSize.height),
    new THREE.MeshBasicMaterial({
      color: 0x000,
    })
  );

  clockTick.position.set(tickSize.position, 1, 0);

  const turningPoint = new THREE.Points();
  turningPoint.rotation.y = 0.5 * Math.PI - (Math.PI / 30) * i;
  turningPoint.add(clockTick);

  scene.add(turningPoint);
}

// Needle - seconds
const seconds = new THREE.Points();

const secondsNeedle = new THREE.Mesh(
  new THREE.BoxBufferGeometry(1.4, 1, 40),
  new THREE.MeshBasicMaterial({
    color: 0xff00000,
  })
);

secondsNeedle.position.z = -10;
seconds.add(secondsNeedle);

const secondsNeedleEnd = new THREE.Mesh(
  new THREE.CylinderBufferGeometry(5, 5, 0.5, 30),
  new THREE.MeshBasicMaterial({
    color: 0xff00000,
  })
);

secondsNeedleEnd.position.z = -30;
seconds.add(secondsNeedleEnd);

const secondsNeedleHub = new THREE.Mesh(
  new THREE.CylinderBufferGeometry(1.5, 1.5, 0.5, 15),
  new THREE.MeshBasicMaterial({
    color: 0xff00000,
  })
);

seconds.add(secondsNeedleHub);

swissClock.add(seconds);

seconds.position.y = 3;

// Needle - minutes
const minutes = new THREE.Points();

const minutesNeedle = new THREE.Mesh(
  new THREE.BoxBufferGeometry(5, 0.5, 55),
  new THREE.MeshBasicMaterial({
    color: 0x000,
  })
);

minutesNeedle.position.z = -15;
minutes.add(minutesNeedle);

swissClock.add(minutes);
minutes.position.y = 2;

// Needle - hours
const hours = new THREE.Points();

const hoursNeedle = new THREE.Mesh(
  new THREE.BoxBufferGeometry(5, 0.5, 45),
  new THREE.MeshBasicMaterial({
    color: 0x000,
  })
);

hoursNeedle.position.z = -10;
hours.add(hoursNeedle);

swissClock.add(hours);
hours.position.y = 1.5;

scene.add(swissClock);

/**
 * Sizes
 */

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */

// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);

camera.position.x = 0;
camera.position.y = 90;
camera.position.z = 0;

scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const tick = () => {
  // Animate Needles
  const today = new Date();

  hours.rotation.y = -((today.getHours() % 12 || 12) / 6) * Math.PI;
  minutes.rotation.y = -(today.getMinutes() / 30) * Math.PI;
  seconds.rotation.y = -(today.getSeconds() / 30) * Math.PI;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
