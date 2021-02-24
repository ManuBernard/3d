import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from "dat.gui"
import CANNON from "cannon"
import "./CannonDebugRenderer"
import Controller from "./controller"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { threeToCannon } from "./threetocannon"
/**
 * Base
 */
// Debug
const gui = new dat.GUI()

const gltfLoader = new GLTFLoader()

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(2, 2, -1)
gui.add(directionalLight, "intensity").min(0).max(1).step(0.001)
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001)
gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001)
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001)
scene.add(directionalLight)

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, "metalness").min(0).max(1).step(0.001)
gui.add(material, "roughness").min(0).max(1).step(0.001)

/**
 * Objects
 */
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material)

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material)
plane.rotation.x = -Math.PI * 0.5

scene.add(sphere, plane)

// Abox
const box2 = new THREE.BoxGeometry(0.5, 0.5, 0.5)
const box2Body = new THREE.Mesh(box2, material)

box2Body.position.x = -3

scene.add(box2Body)

/**
 * Physics
 */
const defaultMaterial = new CANNON.Material("default")
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0,
    restitution: 0,
  }
)

const world = new CANNON.World()
world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial

world.gravity.set(0, -22, 0)

// Player sphere
const sphereShape = new CANNON.Sphere(0.5)
const sphereBody = new CANNON.Body({
  mass: 100,
  position: new CANNON.Vec3(0, 0.5, 0),
  shape: sphereShape,
})

sphereBody.fixedRotation = true
sphereBody.updateMassProperties()

world.addBody(sphereBody)
world.addBody(superCollider(box2Body, { mass: 1 }))

// Abox
const shape = new CANNON.Box(new CANNON.Vec3(1, 0.2, 15))
const boxBody = new CANNON.Body({
  mass: 0,
  position: new CANNON.Vec3(2, 1, 0),
  shape: shape,
})
boxBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.05)
world.addBody(boxBody)

// Floor
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.mass = 0
floorBody.addShape(floorShape)
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI / 2)
world.addBody(floorBody)

var cannonDebugRenderer = new THREE.CannonDebugRenderer(scene, world)

/**
 * Forces
 */

let jumping = false
/**
 * Controller
 */

const controller = new Controller()

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.x = 1
camera.position.y = 3
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - oldElapsedTime
  oldElapsedTime = elapsedTime

  // Update controls
  controls.update()

  // Update physics

  world.step(1 / 60, deltaTime, 3)

  sphere.position.x = sphereBody.position.x
  sphere.position.y = sphereBody.position.y
  sphere.position.z = sphereBody.position.z

  // Moving with keyboard
  const mz = controller.movingZ[0]
  const mx = controller.movingX[0]
  let speed = 5

  if (controller.running) speed = speed * 2

  if (mz && mx) {
    speed = speed / 2
  }
  if (mz) {
    if (mz == "up") {
      sphereBody.velocity.z = -speed
    }
    if (mz == "down") {
      sphereBody.velocity.z = speed
    }
  } else {
    sphereBody.velocity.z = 0
    //   sphereBody.angularVelocity.set(0, 0, 0)
  }

  if (mx) {
    if (mx == "left") {
      sphereBody.velocity.x = -speed
    }
    if (mx == "right") {
      sphereBody.velocity.x = speed
    }
  } else {
    sphereBody.velocity.x = 0
    //  sphereBody.angularVelocity.set(0, 0, 0)
  }

  if (controller.jumping) {
    console.log(jumping)
    if (!jumping) {
      jumping = true
      sphereBody.velocity.y = 9
      // sphereBody.applyLocalForce(
      //   new CANNON.Vec3(0, 1050, 0),
      //   new CANNON.Vec3(0, 0, 0)
      // )
    }
  }

  //feetRaycast()

  // Render
  renderer.render(scene, camera)

  // Update cannon debug
  cannonDebugRenderer.update()

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()

// function feetRaycast() {
//   const rayCaster = new CANNON.RaycastResult()
//   const rayCastLength = 0.57
//   const raySafeOffset = 0.13
//   // Player ray casting
//   // Create ray
//   let body = sphereBody
//   // body.shapes.forEach((shape) => {
//   //   shape.collisionFilterMask = 1
//   // })

//   const start = new CANNON.Vec3(
//     body.position.x,
//     body.position.y,
//     body.position.z
//   )
//   const end = new CANNON.Vec3(
//     body.position.x,
//     body.position.y - 1,
//     body.position.z
//   )
//   // Raycast options
//   const rayCastOptions = {
//     // collisionFilterMask: -1,
//     skipBackfaces: true /* ignore back faces */,
//   }
//   // Cast the ray

//   const rayHasHit = world.raycastClosest(start, end, rayCastOptions, rayCaster)

//   console.log(rayCaster)

//   if (rayHasHit) {
//     if (jumping) jumping = false
//   }
// }
var contactNormal = new CANNON.Vec3() // Normal in the contact, pointing *out* of whatever the player touched
var upAxis = new CANNON.Vec3(0, 1, 0)

sphereBody.addEventListener("collide", function (e) {
  let contact = e.contact

  // contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
  // We do not yet know which one is which! Let's check.
  if (contact.bi.id == sphereBody.id)
    // bi is the player body, flip the contact normal
    contact.ni.negate(contactNormal)
  else contact.ni.copy(contactNormal) // bi is something else. Keep the normal as it is

  // If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
  if (contactNormal.dot(upAxis) > 0.5)
    // Use a "good" threshold value between 0 and 1 here!
    jumping = false
})

// Load scene

gltfLoader.load("/3d/test.glb", (gltf) => {
  gltf.scene.traverse((child) => {
    console.log(child)
    if (child.type === "Mesh") {
      let phys = superCollider(child, { mass: 1 })
      console.log(phys)
      phys.mass = 1

      world.addBody(phys)

      phys.position.copy(child.position)
      phys.quaternion.copy(child.quaternion)

      phys.collisionFilterMask = 1
      phys.collisionFilterGroup = 1

      phys.computeAABB()
      // let phys = new superCollider(child, {})
      // const shape = new CANNON.Box(
      //   new CANNON.Vec3(child.scale.x, child.scale.y, child.scale.z)
      // )
      // const boxBody = new CANNON.Body({
      //   mass: 0,
      //   position: new CANNON.Vec3(2, 1, 0),
      //   shape: shape,
      // })

      // boxBody.collisionFilterMask = 1
      // boxBody.collisionFilterGroup = 1

      // console.log(child.position)

      // console.log(boxBody)
      // boxBody.position.copy(child.position)
      // boxBody.quaternion.copy(child.quaternion)
      // world.addBody(boxBody)
    }
  })
  scene.add(gltf.scene)
})

function superCollider(meshParam, options) {
  const mesh = meshParam.clone()

  let config = {
    mass: 0,
    position: mesh.position,
    rotation: mesh.quaternion,
    friction: 0.3,
    ...options,
  }

  let mat = new CANNON.Material("triMat")
  mat.friction = config.friction
  // mat.restitution = 0.7;

  let shape = threeToCannon(mesh, { type: threeToCannon.Type.MESH })
  // shape['material'] = mat;

  // Add phys sphere
  let physBox = new CANNON.Body({
    mass: config.mass,
    position: config.position,
    quaternion: config.rotation,
    shape: shape,
  })

  physBox.material = mat

  return physBox
}
