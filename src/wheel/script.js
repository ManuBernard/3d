import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from "dat.gui"
import { Mesh } from "three"

import pia1 from "./piaget/1.jpg"
import pia2 from "./piaget/2.jpg"
import pia3 from "./piaget/3.jpg"
import pia4 from "./piaget/4.jpg"
import pia5 from "./piaget/5.jpg"
import pia6 from "./piaget/6.jpg"
import pia7 from "./piaget/7.jpg"
import pia8 from "./piaget/8.jpg"

/**
 * Textures
 */

const textureLoader = new THREE.TextureLoader()

const photos = [
  textureLoader.load(pia1),
  textureLoader.load(pia2),
  textureLoader.load(pia3),
  textureLoader.load(pia4),
  textureLoader.load(pia5),
  textureLoader.load(pia6),
  textureLoader.load(pia7),
  textureLoader.load(pia8),
]

/**
 * Base
 */
// Debug

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

scene.background = new THREE.Color("#14d0c6")

/**
 * Create plans
 */
const wheelConfig = {
  plansCount: 8,
  ray: 1,
  rayRandomness: 0.2,
  offsetRandomness: 0.3,
  sizeInitial: 0.6,
  sizeRandomness: 0.2,
  rotationSpeed: 0.003,
}

const wheel = new THREE.Group()

for (let i = 0; i < wheelConfig.plansCount; i++) {
  // Create the geometry
  const planGeometry = new THREE.PlaneGeometry(
    wheelConfig.sizeInitial,
    wheelConfig.sizeInitial
  )

  // Set the texture
  const planMaterial = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
  })
  planMaterial.map = photos[i]

  // Create the mesh
  const plan = new Mesh(planGeometry, planMaterial)

  // Rotate the plan
  plan.rotation.x = ((Math.PI * 2) / wheelConfig.plansCount) * i

  // Position the plan
  const ray =
    wheelConfig.ray + (Math.random() - 0.5) * wheelConfig.rayRandomness
  plan.translateZ(ray)

  // Scale the plan
  const scale = 1 + (Math.random() - 0.5) * wheelConfig.sizeRandomness
  plan.geometry.scale(scale, scale, scale)

  // Offset the plan on the side
  const offset = (Math.random() - 0.5) * wheelConfig.offsetRandomness
  plan.position.x = offset
  wheel.add(plan)
}

scene.add(wheel)

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
camera.position.y = 1
camera.position.z = 2
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

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()
  wheel.rotation.x += wheelConfig.rotationSpeed

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
