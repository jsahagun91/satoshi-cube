import * as THREE from 'three';
import "../style.css"
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

// Function to create a Face texture / text for
// BTC/USD 
// Block Height
// Blocks until halving
const createTextTexture = (label, value) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = 256;
  canvas.height = 256;

  context.fillStyle = 'orange';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = 'black';
  context.font = '27px Ropa Sans';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
 
  // label and value on separate lines
  context.fillText(label, 128, 106); // Position for the label
  context.fillText(value, 128, 150); // Position for the value (below)

  return new THREE.CanvasTexture(canvas);
};

// Time Face
const createTimeTexture = (label) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = 256;
  canvas.height = 256;

  context.fillStyle = 'orange';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = 'black';
  context.font = '32px Ropa Sans';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
 
  // Time text
  context.fillText(label, 128, 128);

  return new THREE.CanvasTexture(canvas);
};

// Date Face
const createDateTexture = (label) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = 256;
  canvas.height = 256;

  context.fillStyle = 'orange';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = 'black';
  context.font = '32px Ropa Sans';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
 
  // Date text
  context.fillText(label, 128, 128);

  return new THREE.CanvasTexture(canvas);
};


// Add Cube to scene
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

// Position the hemiLight under the cube
hemiLight.position.set(0, -5, 0); // Adjust the Y-coordinate as needed

// Add the HemisphereLight to the scene
scene.add(hemiLight);


// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 25
scene.add(camera)

// Renderer in div
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2)
renderer.render(scene, camera)

// Apply rotation to the cube
// cube.rotation.x = Math.PI / 3.5; // Rotate X-axis
// cube.rotation.y = Math.PI / 5; // Rotate Y-axis
cube.rotation.z = Math.PI / 8; // Rotate Z-axis

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5

// Resize according to window/screen size
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

// Animate nav bar and title onto screen
const tl = gsap.timeline({ defaults: { duration: 1 } })
tl.fromTo(cube.scale, {z:0, x:0, y:0}, {z:1, x:1, y:1})
tl.fromTo('nav', {y: "-100%" }, { y: "0%" })
// tl.fromTo(".title", { opacity: 0 }, { opacity: 1 })

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
  context.fillStyle = 'black'; 
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

      const texture = createTextTexture("Bloques Para El Halving", `${blocksUntilHalving}`);
      materials[2].map = texture;
      materials[2].needsUpdate = true;
    })
    .catch(console.error);
};

// update the cube
blockHalvening();


const regularTextTwo = "₿";
const regularTextTextureTwo = createRegularTextTextureTwo(regularTextTwo);
materials[3].map = regularTextTextureTwo; //  update specific face
materials[3].needsUpdate = true;


/// =========================== ///
// Function to fetch block count and update the texture
const fetchBlockCountAndUpdate = () => {
  fetch('https://blockchain.info/q/getblockcount')
    .then(response => response.text())
    .then(blockCount => {
      const texture = createTextTexture("Altura de Bloques", `${blockCount}`);
      materials[4].map = texture; // Update specific face
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
        materials[1].map = texture; // Update specific face
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
setInterval(blockHalvening, 15000);


// Function to update the time texture
const updateTimeTexture = () => {
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  const timeTexture = createTimeTexture(timeString);
  materials[0].map = timeTexture; // Update specific face 
  materials[0].needsUpdate = true;
};

// Function to update the date texture
const updateDateTexture = () => {
  const now = new Date();
  
  // Define options to get day, month, and year parts separately
  const day = now.toLocaleDateString('es-US', { day: '2-digit' });
  const month = now.toLocaleDateString('es-US', { month: '2-digit' });
  const year = now.toLocaleDateString('es-US', { year: 'numeric' });

  // Construct the date string with day first and month second
  const dateString = `${day}/${month}/${year}`;

  const dateTexture = createDateTexture(dateString);
  materials[5].map = dateTexture; // Update specific face 
  materials[5].needsUpdate = true;
};

// Initial time update
updateTimeTexture();
updateDateTexture();

// Update time and date every second
setInterval(updateTimeTexture, 1000);
setInterval(updateDateTexture, 1000); 


// Function to rotate more
function animate(time) {

  // Convert time to seconds
  time *= 0.0005; 

  // Oscillate the cube's rotation
  cube.rotation.x = Math.sin(time) * Math.PI / 4; // Oscillate around X-axis
  cube.rotation.y = Math.cos(time) * Math.PI / 4; // Oscillate around Y-axis

  const minIntensity = 1;
  const maxIntensity = 2.0;
  hemiLight.intensity = minIntensity + Math.random() * (maxIntensity - minIntensity);

  // Render scene
  renderer.render(scene, camera);

  // Request next frame
  requestAnimationFrame(animate);

}

// Original loop
requestAnimationFrame(animate);

// Cursor Grab 
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects([cube]);

    // Change cursor style based on whether the cube is intersected
    if (intersects.length > 0) {
        canvas.style.cursor = 'grab';
    } else {
        canvas.style.cursor = 'default';
    }
}

// Listen for mouse move events
window.addEventListener('mousemove', onMouseMove, false);
