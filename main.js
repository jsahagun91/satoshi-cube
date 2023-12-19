import * as THREE from 'three';
import "./style.css"
import gsap from 'gsap'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// Scene 
const scene = new THREE.Scene();

// Set the background color of the scene 
scene.background = new THREE.Color('black');

// Create our block
const geometry = new RoundedBoxGeometry(5, 5, 5, 10, 0.5);

const materials = [
  new THREE.MeshPhongMaterial({ color: 'orange' }),
  new THREE.MeshPhongMaterial({ color: 'orange' }),
  new THREE.MeshPhongMaterial({ color: 'orange' }),
  new THREE.MeshPhongMaterial({ color: 'orange' }),
  new THREE.MeshPhongMaterial({ color: 'orange' }),
  new THREE.MeshPhongMaterial({ color: 'orange' })
];

// Function to create a texture from text
const createTextTexture = (label, value) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = 256;
  canvas.height = 256;

    // Set the background color to orange
    context.fillStyle = 'orange';
    context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = 'black';
  context.font = '32px Ropa Sans';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
 
  // Draw the label and value on separate lines
  context.fillText(label, 128, 106); // Position for the label
  context.fillText(value, 128, 150); // Position for the value (below the label)

  return new THREE.CanvasTexture(canvas);
};

const createTimeTexture = (label) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = 256;
  canvas.height = 256;

    // Set the background color to orange
    context.fillStyle = 'orange';
    context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = 'black';
  context.font = '32px Ropa Sans';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
 
  // Time
  context.fillText(label, 128, 128);

  return new THREE.CanvasTexture(canvas);
};


const cube = new THREE.Mesh(geometry, materials);
scene.add(cube);


// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}
// Light
const light = new THREE.PointLight(0xff0000, 1, 100)
light.position.set(50, 50, 50)
scene.add(light)

const hemLight = new THREE.HemisphereLight( 0xffffbb, 0x888888, 5.5 );
scene.add( hemLight );

// Create a HemisphereLight
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x888888, 2);
// The first parameter is the sky color, the second is the ground color, and the third is the intensity

// Position the light under the cube
hemiLight.position.set(0, -5, 0); // Adjust the Y-coordinate as needed

// Add the HemisphereLight to the scene
scene.add(hemiLight);


// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 20
scene.add(camera)

// Renderer 
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2)
renderer.render(scene, camera)

// Apply rotation to the cube
// cube.rotation.x = Math.PI / 3.5; // Rotate 45 degrees around the X-axis
// cube.rotation.y = Math.PI / 5; // Rotate 45 degrees around the Y-axis
cube.rotation.z = Math.PI / 8; // Rotate 45 degrees around the Y-axis

//Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5

// Resize
window.addEventListener('resize', () => {
  // updates sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight 
  // update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
})

const loop = () => {
  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(loop)
}
loop()

// Timeline magic
const tl = gsap.timeline({ defaults: { duration: 1 } })
tl.fromTo(cube.scale, {z:0, x:0, y:0}, {z:1, x:1, y:1})
tl.fromTo('nav', {y: "-100%" }, { y: "0%" })
// tl.fromTo(".title", { opacity: 0 }, { opacity: 1 })

// Function to create a texture from regular text
const createRegularTextTexture = (text) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = 256;
  canvas.height = 256;

      // Set the background color to orange
      context.fillStyle = 'orange';
      context.fillRect(0, 0, canvas.width, canvas.height);

  // Set background and text properties for regular text
  context.fillStyle = 'black'; // Black background
  context.font = '32px Ropa Sans';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, 128, 128);

  return new THREE.CanvasTexture(canvas);
};

// Function to create a texture from regular text
const createRegularTextTextureTwo = (text) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = 256;
  canvas.height = 256;

      // Set the background color to orange
      context.fillStyle = 'orange';
      context.fillRect(0, 0, canvas.width, canvas.height);

  // Set background and text properties for regular text
  context.fillStyle = 'black'; // Black background
  context.font = '32px Ropa Sans';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, 128, 128);

  return new THREE.CanvasTexture(canvas);
};

const blockHalvening = () => {
  fetch('https://blockchain.info/q/getblockcount')
    .then(response => response.text())
    .then(blockCount => {
      const currentBlockCount = parseInt(blockCount, 10);
      const blocksPerHalving = 210000;
      const nextHalvingBlock = Math.ceil(currentBlockCount / blocksPerHalving) * blocksPerHalving;
      const blocksUntilHalving = nextHalvingBlock - currentBlockCount;

      const texture = createTextTexture("Blocks Until Halving", `${blocksUntilHalving}`);
      materials[2].map = texture; // Update a specific face (e.g., the top face)
      materials[2].needsUpdate = true;
    })
    .catch(console.error);
};

// Call the function to update the cube
blockHalvening();


const regularTextTwo = "₿";
const regularTextTextureTwo = createRegularTextTextureTwo(regularTextTwo);
materials[3].map = regularTextTextureTwo; // Apply to a different face,
materials[3].needsUpdate = true;



/// =========================== ///
// Function to fetch block count and update the texture
const fetchBlockCountAndUpdate = () => {
  fetch('https://blockchain.info/q/getblockcount')
    .then(response => response.text())
    .then(blockCount => {
      const texture = createTextTexture("Block Height", `${blockCount}`);
      materials[4].map = texture; // Update a specific face (e.g., the top face)
      materials[4].needsUpdate = true;
    })
    .catch(console.error);
};

// Function to fetch Bitcoin prices and update the texture
const fetchBitcoinPriceAndUpdate = () => {
    fetch('https://blockchain.info/ticker')
      .then(response => response.json())
      .then(prices => {
        const usdPrice = prices.USD.last;
        const texture = createTextTexture("BTC/USD", `$${usdPrice}`);
        materials[1].map = texture; // Update a specific face (e.g., the top face)
        materials[1].needsUpdate = true;
      })
      .catch(console.error);
  };

// Initial fetch
fetchBlockCountAndUpdate();
fetchBitcoinPriceAndUpdate();

// Refresh data every 15 seconds
setInterval(fetchBlockCountAndUpdate, 15000);
setInterval(fetchBitcoinPriceAndUpdate, 15000);

// Function to update the time texture
const updateTimeTexture = () => {
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  const timeTexture = createTimeTexture(timeString);
  materials[0].map = timeTexture; // Update a specific face (e.g., the front face)
  materials[0].needsUpdate = true;
};

// Function to update the date texture
const updateDateTexture = () => {
  const now = new Date();
  const dateString = now.toLocaleDateString();
  const dateTexture = createTimeTexture(dateString);
  materials[5].map = dateTexture; // Update another specific face (e.g., the right face)
  materials[5].needsUpdate = true;
};

// Update time every second and date every hour
setInterval(updateTimeTexture, 1000);
setInterval(updateDateTexture, 3600000); // 3600000 ms = 1 hour

// Initial time update
updateTimeTexture();
updateDateTexture();

// Function to update the cube's properties each frame
function animate(time) {
  // Convert time to seconds
  time *= 0.0005; 

  // Oscillate the cube's rotation
  cube.rotation.x = Math.sin(time) * Math.PI / 4; // Oscillate +/- 45 degrees around the X-axis
  cube.rotation.y = Math.cos(time) * Math.PI / 4; // Oscillate +/- 45 degrees around the Y-axis

  const minIntensity = 1;
  const maxIntensity = 2.0;
  hemiLight.intensity = minIntensity + Math.random() * (maxIntensity - minIntensity);

  // Render the scene
  renderer.render(scene, camera);

  // Request the next frame
  requestAnimationFrame(animate);
}

// Start the animation loop
requestAnimationFrame(animate);

