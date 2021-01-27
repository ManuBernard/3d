import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import * as dat from "dat.gui";

import earthImage from "./textures/earth.jpg";
import jupiterImage from "./textures/jupiter.jpg";
import marsImage from "./textures/mars.jpg";
import mercuryImage from "./textures/mercury.jpg";
import milkywayImage from "./textures/milkyway.jpg";
import neptuneImage from "./textures/neptune.jpg";
import saturnImage from "./textures/saturn.jpg";
import sunImage from "./textures/sun.jpg";
import uranusImage from "./textures/uranus.jpg";
import venusImage from "./textures/venus.jpg";

/**
 * Debug
 */

const gui = new dat.GUI();
// gui.closed = true;

/**
 * Base
 */

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */

const textureLoader = new THREE.TextureLoader();

const planetTextures = {
  milky: textureLoader.load(milkywayImage),
  sun: textureLoader.load(sunImage),
  earth: textureLoader.load(earthImage),
  jupiter: textureLoader.load(jupiterImage),
  mars: textureLoader.load(marsImage),
  mercury: textureLoader.load(mercuryImage),
  neptune: textureLoader.load(neptuneImage),
  saturn: textureLoader.load(saturnImage),
  uranus: textureLoader.load(uranusImage),
  venus: textureLoader.load(venusImage),
};

/**
 * Objects
 */

// Sun
const sunSize = 500;

const sunMaterial = new THREE.MeshBasicMaterial();
sunMaterial.map = planetTextures.sun;

const sun = new THREE.Mesh(
  new THREE.SphereBufferGeometry(sunSize, 40, 40),
  sunMaterial
);

scene.add(sun);

// Milky way
const milkySize = 50000;

const milkyMaterial = new THREE.MeshBasicMaterial();
milkyMaterial.map = planetTextures.milky;
milkyMaterial.side = THREE.BackSide;

const milkyWay = new THREE.Mesh(
  new THREE.SphereBufferGeometry(milkySize, 40, 40),
  milkyMaterial
);

scene.add(milkyWay);

// Planets
let planets = [];

const addplanet = (name, size, distanceToSun, orbitSpeed, rotationSpeed) => {
  const planetMaterial = new THREE.MeshStandardMaterial();

  // Load texture for planet name
  planetMaterial.map = planetTextures[name];

  // Creating a center for rotation
  const planetOrbit = new THREE.Points();

  // Load mesh
  const planet = new THREE.Mesh(
    new THREE.SphereBufferGeometry(size, 40, 40),
    planetMaterial
  );

  // Turn the planet to properly face the sun
  planet.rotation.x = Math.PI / 2;

  // Create a random axe for the orbit
  planetOrbit.rotation.x = Math.random() * 10;

  // Add the planet to its orbit
  planetOrbit.add(planet);

  // Set userdata for planet orbit
  planetOrbit.userData = {
    distanceToSun: distanceToSun + sunSize,
    orbitSpeed: orbitSpeed,
  };

  // Set userdata for planet
  planet.userData = {
    rotationSpeed: rotationSpeed,
  };

  // I forgot why this line
  planet.rotation.z = 1;

  // Adding planet to scene
  scene.add(planetOrbit);

  // Adding planet to arrays
  planets.push(planetOrbit);

  // Add debug lines
  const planetDebug = gui.addFolder(name);

  planetDebug
    .add(planetOrbit.userData, "distanceToSun")
    .min(0)
    .max(10000)
    .name("Distance to sun");
  planetDebug
    .add(planetOrbit.userData, "orbitSpeed")
    .min(0)
    .max(3)
    .name("Orbit speed");
  planetDebug
    .add(planet.userData, "rotationSpeed")
    .min(0)
    .max(3)
    .name("Rotation speed");
};

addplanet("mercury", 30, 120, 1, 1);
addplanet("venus", 75, 220, 0.4, 2);
addplanet("earth", 75, 500, 0.25, 2);
addplanet("mars", 45, 760, 0.13, 3);
addplanet("jupiter", 280, 1560, 0.02, 0.2);
addplanet("saturne", 240, 2860, 0.01, 1);
addplanet("uranus", 190, 5400, 0.01, -2);
addplanet("neptune", 190, 9000, 0.01, 0.5);

/**
 * Light
 */

const pointLight = new THREE.PointLight(0xffffff, 1);

scene.add(pointLight);

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
  1,
  100000
);

camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 1500;

scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.autoRotate = false;
controls.enableDamping = true;
controls.autoRotateSpeed = 0.5;

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

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  planets.forEach((planetOrbit) => {
    const distanceToSun = planetOrbit.userData.distanceToSun;
    const orbitSpeed = planetOrbit.userData.orbitSpeed;
    const rotationSpeed = planetOrbit.children[0].userData.rotationSpeed;

    const calculatedRotationSpeed = distanceToSun + elapsedTime * orbitSpeed;

    // Rotate the planet around the sun
    planetOrbit.children[0].position.y =
      Math.sin(calculatedRotationSpeed) * distanceToSun;
    planetOrbit.children[0].position.x =
      Math.cos(calculatedRotationSpeed) * distanceToSun;

    // Rotate the planet arount itself
    planetOrbit.children[0].rotation.y += rotationSpeed / 100;
  });

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
