/** @module Player */

import * as THREE from "three";

import Controller from "./controller";

export default class Player {
  constructor(options) {
    this._player = null;
    this._body = null;
    this._physic = null;

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

    if (mz) {
      const vector =
        mz == "up" ? -calculatedSpeedBasedOnAngle : calculatedSpeedBasedOnAngle;
      this._player.translateZ(vector);
    }

    if (mx) {
      const vector =
        mx == "left"
          ? -calculatedSpeedBasedOnAngle
          : calculatedSpeedBasedOnAngle;
      this._player.translateX(vector);
    }

    // Body Rotation
    if (mz == "down" && !mx) {
      this._body.rotation.y = 0;
    } else if (mz == "down" && mx == "right") {
      this._body.rotation.y = Math.PI * 0.25;
    } else if (mx == "right" && !mz) {
      this._body.rotation.y = Math.PI * 0.5;
    } else if (mz == "up" && mx == "left") {
      this._body.rotation.y = Math.PI * 1.25;
    } else if (mz == "up" && !mx) {
      this._body.rotation.y = Math.PI;
    } else if (mz == "up" && mx == "right") {
      this._body.rotation.y = Math.PI * 0.75;
    } else if (mx == "left" && !mz) {
      this._body.rotation.y = Math.PI * 1.5;
    } else if (mz == "down" && mx == "left") {
      this._body.rotation.y = Math.PI * 1.75;
    }
  }

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
