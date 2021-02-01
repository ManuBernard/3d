import "./style.css";
import * as THREE from "three";

import imageSource from "./textures/1.png";
import damierSource from "./textures/damier.jpg";

import "./js/init.js";

import { textureLoader } from "./js/textureLoader.js";
import { scene } from "./js/scene.js";
import { animations } from "./js/animation.js";
import { camera } from "./js/camera";

const matcapTexture = textureLoader.load(imageSource);
const damierTexture = textureLoader.load(damierSource);

console.log(damierTexture);
/**
 * Objects
 */

damierTexture.repeat.set(8, 8, 8);
damierTexture.wrapS = THREE.RepeatWrapping;
damierTexture.wrapT = THREE.RepeatWrapping;

// Ambient light
const ambientLight = new THREE.AmbientLight("#b9d5ff", 1);
scene.add(ambientLight);

const ground = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(35, 35),
  new THREE.MeshStandardMaterial({ map: damierTexture })
);

ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.5;

const directionnalCube = new THREE.Mesh(
  new THREE.BoxBufferGeometry(0.3, 0.3, 0.3),
  new THREE.MeshStandardMaterial({ color: "red", wireframe: true })
);

const bonhomme = new THREE.Group();

const body = new THREE.Mesh(
  new THREE.BoxBufferGeometry(0.75, 1, 0.25),
  new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
);

const head = new THREE.Mesh(
  new THREE.BoxBufferGeometry(0.5, 0.5, 0.5),
  new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
);

const hair = new THREE.Mesh(
  new THREE.BoxBufferGeometry(0.6, 0.6, 0.6),
  new THREE.MeshStandardMaterial({ color: "black" })
);

const eyebrow = new THREE.Mesh(
  new THREE.BoxBufferGeometry(0.3, 0.1, 0.1),
  new THREE.MeshStandardMaterial({ color: "black" })
);

head.add(hair);
head.add(eyebrow);
hair.position.z = -0.1;
hair.position.y = 0.1;

eyebrow.position.z = 0.26;

head.position.y = 0.75;
bonhomme.add(body, head);

directionnalCube.position.y = 1.2;

const cube = new THREE.Mesh(
  new THREE.BoxBufferGeometry(1, 1, 1),
  new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
);

scene.add(ground, directionnalCube);

directionnalCube.add(bonhomme);

// Set the animation
animations.push((elapsedTime) => {
  camera.lookAt(directionnalCube.position);
  const lookAt = new THREE.Vector3(
    camera.position.x,
    directionnalCube.position.y,
    camera.position.z
  );
  directionnalCube.lookAt(lookAt);
  // bonhomme.position.x = directionnalCube.position.x;
  // bonhomme.position.z = directionnalCube.position.z;
});

document.addEventListener("keydown", function (event) {
  const keyCode = event.which;
  if (keyCode == 38) {
    directionnalCube.translateZ(-0.5);
    bonhomme.rotation.y = Math.PI;
  } else if (keyCode == 40) {
    directionnalCube.translateZ(0.5);
    bonhomme.rotation.y = 0;
  } else if (keyCode == 37) {
    directionnalCube.translateX(-0.5);
    bonhomme.rotation.y = Math.PI * 1.5;
  } else if (keyCode == 39) {
    directionnalCube.translateX(0.5);
    bonhomme.rotation.y = Math.PI * 0.5;
  }
});
