import * as THREE from 'three';
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from 'gsap'

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('black');

// Camera
const sizes = { width: window.innerWidth, height: window.innerHeight };
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 30;
scene.add(camera);

// Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

// Lights
const light = new THREE.PointLight(0x800080, 1, 100);
light.position.set(50, 50, 50);
scene.add(light);

const hemLight = new THREE.HemisphereLight(0xffffbb, 0x888888, 1);
scene.add(hemLight);

// Orbit Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Resize handler
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

// Particle Geometry and Material
const particleGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1); // Small cube geometry
const particleMaterial = new THREE.MeshPhongMaterial({ color: '#FC0FC0' }); // Set color to pink

// Adjust your lights as needed, for example:
light.intensity = 200; // Adjust intensity
light.position.set(0, 0, 0); // Adjust position

// Optional - Enable Shadows
renderer.shadowMap.enabled = true;
light.castShadow = true;

// Function to create particles with animation
let particles;
function createParticles(txCount) {
  if (particles) {
    scene.remove(particles);
  }
  const particleSystem = new THREE.Group();
  for (let i = 0; i < txCount; i++) {
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    
    // Set initial position for animation start
    particle.position.set(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5);
    particle.scale.set(0, 0, 0); // Start with a scale of 0

    // Add animation
    gsap.to(particle.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 1,
      ease: "power2.out",
      delay: i * .001 // Stagger the animation of each particle
    });

    particleSystem.add(particle);
  }
  particles = particleSystem;
  scene.add(particleSystem);
}


function updateBlockHeightInFooter(blockHeight) {
  const blockHeightElement = document.getElementById('blockHeight');
  if (blockHeightElement) {
    blockHeightElement.textContent = blockHeight;
  }
}

// Function to fetch current block height and tx count
function fetchBlockData() {
  fetch('https://mempool.space/api/blocks/tip/height')
    .then(response => response.text())
    .then(blockHeight => {
      console.log("Current Block Height:", blockHeight);
      updateBlockHeightInFooter(blockHeight);
      return fetch(`https://mempool.space/api/v1/blocks/${blockHeight}`);
    })
    .then(response => response.json())
    .then(blockData => {
      console.log("Block Data:", blockData); 
      const txCount = blockData[0].tx_count;
      console.log("Transaction Count:", txCount);
      createParticles(txCount);
    })
    .catch(console.error);
}

// Initial fetch
fetchBlockData();

// Animation Loop
const animate = () => {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();
