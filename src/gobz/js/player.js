import * as THREE from "three";
import Controller from "./controller";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const gltfLoader = new GLTFLoader();

export default class Player {
  constructor(options) {
    this.direction = null;
    this.body = null;

    this.rayDirection = new THREE.Raycaster();
    this.rayVertical = new THREE.Raycaster();

    this.isMoving = false;
    this.actions = {};
    this.victory = false;

    this.jump = {
      active: false,
      step: 0,
      ready: true,
    };

    this.options = {
      speed: 0.1,
      jumpStep: 0.1,
      jumpHeigh: 5,
      jumpDelay: 350,
      ...options,
    };

    this.initPlayer();
    this.initBody();

    this.controller = new Controller();
  }

  addBody(body) {
    this.body = body;
    this.direction.add(body);
  }

  playAnimation(deltaTime) {
    if (!this.mixer) return;
    const animStep = 0.1;

    this.mixer.update(deltaTime);

    const currentActionWeight = this.currentAction.getEffectiveWeight();

    if (currentActionWeight < 1) {
      this.currentAction.setEffectiveWeight(currentActionWeight + animStep);
    }

    for (let key in this.actions) {
      const otherAction = this.actions[key];
      if (otherAction != this.currentAction) {
        const otherActionWeight = otherAction.getEffectiveWeight();
        if (otherActionWeight > 0) {
          otherAction.setEffectiveWeight(otherActionWeight - animStep);
        }
      }
    }
  }

  jumpStart() {
    if (this.onTheGround && this.jump.ready) {
      this.jump.active = true;
      this.jump.ready = false;
      this.direction.position.y += 0.5;
      this.jump.initialY = this.direction.position.y;
      this.mixer.setTime(0);
    }
  }

  jumpEnd() {
    this.jump.step = 0;
    this.jump.active = false;
    window.setTimeout(
      function () {
        this.jump.ready = true;
      }.bind(this),
      this.options.jumpDelay
    );
  }

  playVictory() {
    this.victory = true;
    const victorySound = new Audio("/sounds/victory.mp3");
    victorySound.play();
    this.currentAction = this.actions.twerk;
  }
  /**
   * Move the player in the stage
   */
  onTick(elapsedTime, deltaTime) {
    if (!this.collisionObject) return;

    this.playAnimation(deltaTime);

    if (this.victory) return;

    const mz = this.controller.movingZ[0];
    const mx = this.controller.movingX[0];

    // Change animation based on action
    if (this.jump.active) {
      this.currentAction = this.actions.jump;
    } else if (this.isMoving) {
      if (this.running) {
        this.currentAction = this.actions.run;
      } else {
        this.currentAction = this.actions.walk;
      }
    } else {
      this.currentAction = this.actions.iddle;
    }

    // Update running
    this.running = this.controller.running;

    // Player orientation
    let calculatedSpeedBasedOnAngle = this.options.speed;

    if (mz || mx) {
      if (!this.isMoving) {
        calculatedSpeedBasedOnAngle = Math.sin(45) * this.options.speed;
      }
      this.isMoving = true;
    } else {
      this.isMoving = false;
    }

    // Update speed if running
    if (this.running) calculatedSpeedBasedOnAngle *= 2;

    // Jump
    let newPlayerJumpY;

    if (this.controller.jumping && !this.jump.active) {
      this.jumpStart();
    }

    if (this.jump.active) {
      this.jump.step += this.options.jumpStep;

      newPlayerJumpY =
        this.jump.initialY + Math.sin(this.jump.step) * this.options.jumpHeigh;
    }

    if (this.jump.step > Math.PI) {
      this.jumpEnd();
    }

    // Follow the ground
    const rayOrigin = this.direction.position.clone();
    const rayDirection = new THREE.Vector3(0, -1, 0);

    rayOrigin.y += 0.5;
    rayDirection.normalize();

    this.rayVertical.set(rayOrigin, rayDirection);

    const intersect = this.rayVertical.intersectObjects(this.collisionObject);

    let newPos = this.direction.position.y;
    if (intersect[0]) {
      if (intersect[0].distance == 0.5) {
        this.onTheGround = true;
        if (intersect[0].object.name.toLowerCase().startsWith("victory")) {
          this.playVictory();
        }
      }
      if (intersect[0].distance < 0.5) {
        // Going up
        newPos += 0.5 - intersect[0].distance;
        this.jumpEnd();
      } else if (intersect[0].distance > 0.5) {
        // Going down
        if (!this.jump.active) {
          if (intersect[0].distance > 1) {
            newPos -= 0.4;
          } else {
            newPos -= intersect[0].distance - 0.5;
          }
        } else {
          newPos = newPlayerJumpY;
        }
      } else {
        if (this.jump.active) {
          newPos = newPlayerJumpY;
        }
      }
    }

    this.direction.position.y = Math.round(newPos * 10) / 10;
    this.direction.position.y = newPos;

    // Collision with walls
    let horizontalRayCasterDirection;

    // Body Rotation
    if (mz == "down" && !mx) {
      this.body.rotation.y = 0;
      horizontalRayCasterDirection = new THREE.Vector3(0, 0, 1);
    } else if (mz == "down" && mx == "right") {
      this.body.rotation.y = Math.PI * 0.25;
      horizontalRayCasterDirection = new THREE.Vector3(1, 0, 1);
    } else if (mx == "right" && !mz) {
      this.body.rotation.y = Math.PI * 0.5;
      horizontalRayCasterDirection = new THREE.Vector3(1, 0, 0);
    } else if (mz == "up" && !mx) {
      this.body.rotation.y = Math.PI;
      horizontalRayCasterDirection = new THREE.Vector3(0, 0, -1);
    } else if (mz == "up" && mx == "right") {
      this.body.rotation.y = Math.PI * 0.75;
      horizontalRayCasterDirection = new THREE.Vector3(1, 0, -1);
    } else if (mz == "up" && mx == "left") {
      this.body.rotation.y = Math.PI * 1.25;
      horizontalRayCasterDirection = new THREE.Vector3(-1, 0, -1);
    } else if (mx == "left" && !mz) {
      this.body.rotation.y = Math.PI * 1.5;
      horizontalRayCasterDirection = new THREE.Vector3(-1, 0, 0);
    } else if (mz == "down" && mx == "left") {
      this.body.rotation.y = Math.PI * 1.75;
      horizontalRayCasterDirection = new THREE.Vector3(-1, 0, 1);
    }

    let canMove = true;

    if (horizontalRayCasterDirection) {
      const rayHorizontalOrigin = this.direction.position.clone();

      rayHorizontalOrigin.y += 0.5;

      horizontalRayCasterDirection.normalize();

      console.log(this.collisionObject);
      this.rayVertical.set(rayHorizontalOrigin, horizontalRayCasterDirection);
      const wallIntersects = this.rayVertical.intersectObjects(
        this.collisionObject
      );

      if (
        wallIntersects.length &&
        wallIntersects[0].distance < (this.running ? 2.5 : 0.5)
      ) {
        canMove = false;
      }
    }

    if (canMove) {
      if (mz) {
        const vector =
          mz == "up"
            ? -calculatedSpeedBasedOnAngle
            : calculatedSpeedBasedOnAngle;
        this.direction.translateZ(vector);
      }

      if (mx) {
        const vector =
          mx == "left"
            ? -calculatedSpeedBasedOnAngle
            : calculatedSpeedBasedOnAngle;
        this.direction.translateX(vector);
      }
    }
  }

  initPlayer() {
    this.direction = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.3, 0.3),
      new THREE.MeshStandardMaterial({ color: "red", wireframe: true })
    );

    this.direction.material.visible = true;
    this.direction.name = "Player";
    this.direction.userData.preserve = true;
  }

  initBody() {
    gltfLoader.load(
      "/3d/gobz2.glb",
      function (gltf) {
        this.mixer = new THREE.AnimationMixer(gltf.scene);
        console.log(gltf.animations);
        this.actions.iddle = this.mixer.clipAction(gltf.animations[1]);
        this.actions.jump = this.mixer.clipAction(gltf.animations[2]);
        this.actions.run = this.mixer.clipAction(gltf.animations[3]);
        this.actions.walk = this.mixer.clipAction(gltf.animations[4]);
        this.actions.twerk = this.mixer.clipAction(gltf.animations[0]);

        this.actions.iddle.setEffectiveWeight(1);
        this.actions.walk.setEffectiveWeight(0);
        this.actions.run.setEffectiveWeight(0);
        this.actions.jump.setEffectiveWeight(0);
        this.actions.twerk.setEffectiveWeight(0);

        this.currentAction = this.actions.iddle;

        for (let key in this.actions) {
          const action = this.actions[key];
          action.play();
        }

        this.addBody(gltf.scene);

        gltf.scene.traverse(function (object) {
          if (object.isMesh) object.castShadow = true;
        });
      }.bind(this)
    );
  }
}
