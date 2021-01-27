import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
//import typeFaceFont from "three/examples/fonts/gentilis_regular.typeface.json";

/**
 * Base
 */
// Debug

console.log("io2");

const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/textures/matcaps/7.png");

/**
 * Fonts
 */
const fontLoader = new THREE.FontLoader();

fontLoader.load("/fonts/helvetiker_bold.typeface.json", (font) => {
  const material = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture,
  });

  material.flatShading = true;
  const textGeometry = new THREE.TextBufferGeometry("Hello world", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });

  //textGeometry.computeVertexNormals();
  textGeometry.center();

  //   textGeometry.computeBoundingBox();
  //   console.log(textGeometry.boundingBox);

  //   textGeometry.translate(
  //     -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
  //     -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
  //     -(textGeometry.boundingBox.max.z - 0.05) * 0.5
  //   );

  //   textGeometry.computeBoundingBox();
  //   console.log(textGeometry.boundingBox);

  // textMaterial.wireframe = true;
  const textMesh = new THREE.Mesh(textGeometry, material);

  scene.add(textMesh);

  console.time("donuts");

  const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45);
  const minDonutPositionToCenter = 40;
  for (let index = 0; index < 1000; index++) {
    const donut = new THREE.Mesh(donutGeometry, material);

    donut.position.x = (Math.random() - 0.5) * 100 + minDonutPositionToCenter;
    donut.position.y = (Math.random() - 0.5) * 100 + minDonutPositionToCenter;
    donut.position.z = (Math.random() - 0.5) * 100 + minDonutPositionToCenter;

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    const randomScale = Math.random() * 10;
    donut.scale.x = randomScale;
    donut.scale.y = randomScale;
    donut.scale.z = randomScale;

    scene.add(donut);
  }

  console.timeEnd("donuts");
});

/**
 * Object
 */
// const cube = new THREE.Mesh(
//   new THREE.BoxBufferGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial()
// );

// scene.add(cube);

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
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
