import "./style.css";
import * as THREE from "three";

import imageSource from "./textures/1.png";

import "./js/init.js";

import { textureLoader } from "./js/textureLoader.js";
import { scene } from "./js/scene.js";
import { animations } from "./js/animation.js";
import { gui } from "./js/debug.js";

const matcapTexture = textureLoader.load(imageSource);

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

console.log(scene);

const gltfLoader = new GLTFLoader();

let mixer;
let gltf;

const playAnimation = (index) => {
  mixer = new THREE.AnimationMixer(gltf.scene);

  const action = mixer.clipAction(gltf.animations[index]);

  action.play();
};

const debug = {
  walk: function () {
    playAnimation(3);
  },
  run: function () {
    playAnimation(1);
  },
  tmode: function () {
    playAnimation(2);
  },
  iddle: function () {
    playAnimation(0);
  },
};

gui.add(debug, "walk");
gui.add(debug, "run");
gui.add(debug, "tmode");
gui.add(debug, "iddle");

gltfLoader.load("/3d/girl.gltf", (g) => {
  // gltf.animations.push(anim)

  gltf = g;

  window.requestAnimationFrame(() => {
    playAnimation(0);
  });

  scene.add(gltf.scene);
});

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

animations.push(function (elapsedTime, deltaTime) {
  if (mixer) mixer.update(deltaTime);
});

/**
 * Objects
 */
const floorGeometry = new THREE.CylinderGeometry(2, 2, 0.1, 32);
const floorMaterial = new THREE.MeshStandardMaterial({ color: "grey" });

const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.receiveShadow = true;

scene.add(floor);
