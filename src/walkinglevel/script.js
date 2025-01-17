import "./style.css";
import * as THREE from "three";

import imageSource from "./textures/1.png";

import "./js/init.js";

import { textureLoader } from "./js/textureLoader.js";
import { scene } from "./js/scene.js";
import { animations } from "./js/animation.js";
import { camera } from "./js/camera.js";

import Player from "./js/player";

const matcapTexture = textureLoader.load(imageSource);

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const gltfLoader = new GLTFLoader();

/**
 * Debug
 */
const debug = {
  walk: function () {
    switchAction("walk");
  },
  run: function () {
    switchAction("run");
  },
  tmode: function () {
    switchAction("tmode");
  },
  iddle: function () {
    switchAction("iddle");
  },
};

/**
 * Player
 */
const player = new Player();
camera.player = player;

/**
 * Animations
 */
let currentAction = null;
const actions = {};
const step = 0.1;

const switchAction = (to) => {
  currentAction = actions[to];
};

gltfLoader.load("/3d/level.glb", (gltf) => {
  console.log(gltf.scene);
  scene.add(gltf.scene);
  gltf.scene.scale.x = 5;
  gltf.scene.scale.y = 5;
  gltf.scene.scale.z = 5;

  gltf.scene.traverse(function (object) {
    if (object.isMesh) object.castShadow = true;
    if (object.isMesh) object.receiveShadow = true;
  });

  player.collisionObject = gltf.scene;
});

gltfLoader.load("/3d/girl.gltf", (gltf) => {
  const mixer = new THREE.AnimationMixer(gltf.scene);

  animations.push(function (elapsedTime, deltaTime) {
    mixer.update(deltaTime);
  });

  actions.iddle = mixer.clipAction(gltf.animations[0]);
  actions.walk = mixer.clipAction(gltf.animations[3]);
  actions.run = mixer.clipAction(gltf.animations[1]);
  actions.tmode = mixer.clipAction(gltf.animations[2]);

  currentAction = actions.iddle;

  animations.push(function (elapsedTime, deltaTime) {
    const currentActionWeight = currentAction.getEffectiveWeight();

    if (currentActionWeight < 1) {
      currentAction.setEffectiveWeight(currentActionWeight + step);
    }

    for (let key in actions) {
      const otherAction = actions[key];
      if (otherAction != currentAction) {
        const otherActionWeight = otherAction.getEffectiveWeight();
        if (otherActionWeight > 0) {
          otherAction.setEffectiveWeight(otherActionWeight - step);
        }
      }
    }
  });

  for (let key in actions) {
    const action = actions[key];
    action.play();
  }

  actions.iddle.setEffectiveWeight(1);
  actions.walk.setEffectiveWeight(0);
  actions.run.setEffectiveWeight(0);
  actions.tmode.setEffectiveWeight(0);

  player.addBody(gltf.scene);
  player.animations = debug;

  scene.add(player.get());

  gltf.scene.traverse(function (object) {
    if (object.isMesh) object.castShadow = true;
  });

  animations.push(function (elapsedTime, deltaTime) {
    player.onTick();
  });
});

/**
 * Lights
 */
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff);
dirLight.shadow.mapSize.set(2048 * 4, 2048 * 4);
dirLight.position.set(-3, 30, -40);
dirLight.castShadow = true;
dirLight.shadow.camera.top = 45;
dirLight.shadow.camera.bottom = -45;
dirLight.shadow.camera.left = -55;
dirLight.shadow.camera.right = 55;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 240;
scene.add(dirLight);

/**
 * Objects
 */
const floorGeometry = new THREE.CylinderGeometry(105, 105, 0.1, 32);
const floorMaterial = new THREE.MeshPhongMaterial({ color: "grey" });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.receiveShadow = true;

// scene.add(floor);
scene.background = new THREE.Color(0xa0a0a0);
scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);
