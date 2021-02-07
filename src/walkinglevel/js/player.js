/** @module Player */

import * as THREE from "three";

import Controller from "./controller";
import { scene } from "./scene";

export default class Player {
  constructor(options) {
    this._player = null;
    this._body = null;
    this._physic = null;

    this._rayDirection = new THREE.Raycaster();
    this._rayVertical = new THREE.Raycaster();

    this._isMoving = false;
    this.animations = null;

    this.options = { speed: 0.1, ...options };

    this._initPlayer();
    this._initBody();

    this.controller = new Controller();
  }

  addBody(body) {
    this._body = body;
    this._player.add(body);
  }

  /**
   * Get player
   */
  get() {
    return this._player;
  }

  /**
   * Get player body
   */
  getBody() {
    return this._body;
  }

  /**
   * Move the player in the stage
   */
  onTick() {
    const mz = this.controller.movingZ[0];
    const mx = this.controller.movingX[0];

    if (this._isMoving) {
      if (this.controller.running && !this.running) {
        this.animations.run();
      } else if (!this.controller.running && this.running) {
        this.animations.walk();
      }
    }

    this.running = this.controller.running;
    let calculatedSpeedBasedOnAngle = this.options.speed;

    if (mz || mx) {
      if (!this._isMoving) {
        calculatedSpeedBasedOnAngle = Math.sin(45) * this.options.speed;
        if (this.running) {
          this.animations.run();
        } else {
          this.animations.walk();
        }
      }
      this._isMoving = true;
    } else {
      if (this._isMoving) {
        this.animations.iddle();
      }
      this._isMoving = false;
    }

    if (this.running) calculatedSpeedBasedOnAngle *= 2;

    // Vertical ray caster to follow the ground

    const rayOrigin = this._player.position.clone();
    const rayDirection = new THREE.Vector3(0, -1, 0);

    rayOrigin.y += 0.5;
    rayDirection.normalize();

    this._rayVertical.set(rayOrigin, rayDirection);

    const intersect = this._rayVertical.intersectObjects(
      this.collisionObject.children
    );
    // if (!intersect.length) {

    // }else
    console.log(intersect[0].distance);
    if (intersect[0].distance < 0.5) {
      this._player.position.y += 0.5 - intersect[0].distance;
    } else if (intersect[0].distance > 0.5) {
      this._player.position.y -= intersect[0].distance - 0.5;
    }

    // Horizontal reycaster orientation
    let horizontalRayCasterDirection;

    // Body Rotation
    if (mz == "down" && !mx) {
      this._body.rotation.y = 0;
      horizontalRayCasterDirection = new THREE.Vector3(0, 0, 1);
    } else if (mz == "down" && mx == "right") {
      this._body.rotation.y = Math.PI * 0.25;
      horizontalRayCasterDirection = new THREE.Vector3(1, 0, 1);
    } else if (mx == "right" && !mz) {
      this._body.rotation.y = Math.PI * 0.5;
      horizontalRayCasterDirection = new THREE.Vector3(1, 0, 0);
    } else if (mz == "up" && !mx) {
      this._body.rotation.y = Math.PI;
      horizontalRayCasterDirection = new THREE.Vector3(0, 0, -1);
    } else if (mz == "up" && mx == "right") {
      this._body.rotation.y = Math.PI * 0.75;
      horizontalRayCasterDirection = new THREE.Vector3(1, 0, -1);
    } else if (mz == "up" && mx == "left") {
      this._body.rotation.y = Math.PI * 1.25;
      horizontalRayCasterDirection = new THREE.Vector3(-1, 0, -1);
    } else if (mx == "left" && !mz) {
      this._body.rotation.y = Math.PI * 1.5;
      horizontalRayCasterDirection = new THREE.Vector3(-1, 0, 0);
    } else if (mz == "down" && mx == "left") {
      this._body.rotation.y = Math.PI * 1.75;
      horizontalRayCasterDirection = new THREE.Vector3(-1, 0, 1);
    }

    let canMove = true;

    if (horizontalRayCasterDirection) {
      const rayHorizontalOrigin = this._player.position.clone();

      rayHorizontalOrigin.y += 1.5;

      horizontalRayCasterDirection.normalize();
      this._rayVertical.set(rayHorizontalOrigin, horizontalRayCasterDirection);
      const wallIntersects = this._rayVertical.intersectObjects(
        this.collisionObject.children
      );

      if (wallIntersects.length && wallIntersects[0].distance < 1.5) {
        canMove = false;
      }
    }

    if (canMove) {
      if (mz) {
        const vector =
          mz == "up"
            ? -calculatedSpeedBasedOnAngle
            : calculatedSpeedBasedOnAngle;
        this._player.translateZ(vector);
      }

      if (mx) {
        const vector =
          mx == "left"
            ? -calculatedSpeedBasedOnAngle
            : calculatedSpeedBasedOnAngle;
        this._player.translateX(vector);
      }
    }
  }

  // const intersect = this._rayVertical.intersectObjects(
  //   this.collisionObject.children
  // );

  /**
   * Initialize player
   * @Private
   */
  _initPlayer() {
    this._player = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.3, 0.3),
      new THREE.MeshStandardMaterial({ color: "red", wireframe: true })
    );

    this._player.name = "Player";
    this._player.userData.preserve = true;
  }

  /**
   * Initialize player body
   * @Private
   */
  _initBody() {}
}
