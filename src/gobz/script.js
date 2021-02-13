import "./style.css";
import * as THREE from "three";
import * as dat from "dat.gui";

import { renderer } from "./js/renderer.js";
import "./js/canvas.js";
import "./js/animation.js";
import "./js/handleResize.js";

import { scene } from "./js/scene.js";
import { animations } from "./js/animation.js";
import { camera } from "./js/camera.js";

import Player from "./js/player";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const cubeTextureLoader = new THREE.CubeTextureLoader();
// Debug
const gui = new dat.GUI();

gui.hide();
/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();

/**
 * Player
 */
const player = new Player();
camera.player = player;

animations.push(function (elapsedTime, deltaTime) {
  player.onTick(elapsedTime, deltaTime);
});

scene.add(player.direction);

/** Camera move */

animations.push(function (elapsedTime, deltaTime) {
  camera.lookAt(player.direction.position);
  if (!player.victory) {
    //camera.position.z = camera.player.direction.position.z + 18;
    camera.position.y = camera.player.direction.position.y + 4;
    camera.position.x = camera.player.direction.position.x;
  } else {
    camera.position.z =
      camera.player.direction.position.z + Math.sin(elapsedTime) * 12;
    camera.position.x =
      camera.player.direction.position.x + Math.cos(elapsedTime) * 12;
  }

  // dirLight.position.set(0.25, 3, -2.25);
  dirLight.position.z = player.direction.position.z - 5;
  dirLight.position.y = player.direction.position.y + 3;
  dirLight.position.x = player.direction.position.x;
});

/**
 * Level
 */
let mixer;
gltfLoader.load("/3d/levelgobz.glb", (gltf) => {
  mixer = new THREE.AnimationMixer(gltf.scene);

  console.log(gltf);

  scene.add(gltf.scene);
  gltf.scene.scale.x = 5;
  gltf.scene.scale.y = 5;
  gltf.scene.scale.z = 5;

  gltf.scene.position.y = -0.5;

  gltf.scene.rotation.y = Math.PI / 2;

  gltf.animations.forEach((animation) => {
    const action = mixer.clipAction(animation);
    action.setEffectiveTimeScale(1);
    action.play();
  });

  animations.push(function (elapsedTime, deltaTime) {
    mixer.update(deltaTime);
  });

  gltf.scene.traverse(function (object) {
    // if (object.isMesh) object.castShadow = true;
    if (object.isMesh) object.receiveShadow = true;
  });

  player.collisionObject = [];
  gltf.scene.traverse((object) => {
    player.collisionObject.push(object);
  });
});

/**
 * Lights
 */
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff);

dirLight.castShadow = true;
dirLight.shadow.camera.far = 15;
dirLight.shadow.mapSize.set(1024, 1024);
dirLight.shadow.normalBias = 0.05;

player.direction.add(dirLight.target);
scene.add(dirLight);

gui
  .add(dirLight, "intensity")
  .min(0)
  .max(10)
  .step(0.001)
  .name("lightIntensity");

gui.add(dirLight.position, "x").min(-5).max(5).step(0.001).name("lightX");

gui.add(dirLight.position, "y").min(-5).max(5).step(0.001).name("lightY");

gui.add(dirLight.position, "z").min(-5).max(5).step(0.001).name("lightZ");

const debug = {
  background: 0xffffff,
  fogNear: 15,
  fogFar: 80,
};

// scene.add(floor);
scene.background = new THREE.Color(debug.background);
scene.fog = new THREE.Fog(debug.background, debug.fogNear, debug.fogFar);

gui.addColor(debug, "background").onChange(() => {
  scene.background.set(debug.background);
  scene.fog.color.set(debug.background);
});

gui
  .add(debug, "fogNear")
  .min(5)
  .max(30)
  .step(0.1)
  .onChange(() => {
    scene.fog.near = debug.fogNear;
  });
gui
  .add(debug, "fogFar")
  .min(15)
  .max(100)
  .step(0.1)
  .onChange(() => {
    scene.fog.far = debug.fogFar;
  });

gui.add(player.options, "speed").min(0.05).max(0.5).step(0.001);

gui
  .add(renderer, "toneMapping", {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping,
  })
  .onFinishChange(() => {
    renderer.toneMapping = Number(renderer.toneMapping);
    updateAllMaterials();
  });

gui.add(renderer, "toneMappingExposure").min(0).max(10).step(0.001);

/**
 * Update all material
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      //  child.material.envMap = environmentMap
      child.material.envMapIntensity = debug.envMapIntensity;
      child.material.needsUpdate = true;

      child.receiveShadow = true;
    }
  });
};

debug.envMapIntensity = 5;
gui
  .add(debug, "envMapIntensity")
  .min(0)
  .max(10)
  .step(0.001)
  .onChange(updateAllMaterials);

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
  "/textures/envmaps/out/px.png",
  "/textures/envmaps/out/nx.png",
  "/textures/envmaps/out/py.png",
  "/textures/envmaps/out/ny.png",
  "/textures/envmaps/out/pz.png",
  "/textures/envmaps/out/nz.png",
]);

environmentMap.encoding = THREE.sRGBEncoding;

scene.environment = environmentMap;

window.setTimeout(() => {
  document.querySelector("#rules").classList.add("visible");
}, 2500);

window.setTimeout(() => {
  document.querySelector("#rules").classList.remove("visible");
}, 10000);
