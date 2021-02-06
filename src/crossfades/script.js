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

const gltfLoader = new GLTFLoader();

let gltf;

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

gui.add(debug, "walk");
gui.add(debug, "run");
gui.add(debug, "tmode");
gui.add(debug, "iddle");

let currentAction = null;

const actions = {};

const step = 0.03;

const switchAction = (to) => {
  currentAction = actions[to];
};

gltfLoader.load("/3d/girl.gltf", (gltf) => {
  const mixer = new THREE.AnimationMixer(gltf.scene);

  animations.push(function (elapsedTime, deltaTime) {
    mixer.update(deltaTime);
  });

  gltf.scene.traverse(function (object) {
    if (object.isMesh) object.castShadow = true;
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

  mixer.addEventListener("loop", (event) => {
    // console.log(event);
  });

  window.requestAnimationFrame(() => {});

  scene.add(gltf.scene);
});

/**
 * Lights
 */
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff);
dirLight.shadow.mapSize.set(1024, 1024);
dirLight.position.set(-3, 10, -10);
dirLight.castShadow = true;
dirLight.shadow.camera.top = 4;
dirLight.shadow.camera.bottom = -2;
dirLight.shadow.camera.left = -2;
dirLight.shadow.camera.right = 2;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 40;
scene.add(dirLight);

/**
 * Objects
 */
const floorGeometry = new THREE.CylinderGeometry(105, 105, 0.1, 32);
const floorMaterial = new THREE.MeshPhongMaterial({ color: "grey" });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.receiveShadow = true;

scene.add(floor);
scene.background = new THREE.Color(0xa0a0a0);
scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);
