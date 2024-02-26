import * as THREE from 'three';
import "./style.css"
import gsap from 'gsap'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// flags
// let isBlockHeightLoaded = false;
// let isMempoolCountLoaded = false;

// Function to create gradient texture
function createGradientTexture() {
  const width = 256;
  const height = 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');

  // Create gradient (vertical gradient from top to bottom)
  let grd = context.createLinearGradient(0, 0, 0, height);
  grd.addColorStop(0, 'purple'); // start with purple
  grd.addColorStop(1, 'skyblue'); // end with skyblue

  // Fill with gradient
  context.fillStyle = grd;
  context.fillRect(0, 0, width, height);

  return new THREE.CanvasTexture(canvas);
}

const gradientTexture = createGradientTexture();

// Scene 
const scene = new THREE.Scene();

// Set the background color of the scene 
scene.background = new THREE.Color('black');

// Create our block
const geometry = new RoundedBoxGeometry(5, 5, 5, 10, 0.5);

const materials = [
  new THREE.MeshPhongMaterial({ color: 'skyblue' }),
  new THREE.MeshPhongMaterial({ color: 'skyblue' }),
  new THREE.MeshPhongMaterial({ color: 'skyblue' }),
  new THREE.MeshPhongMaterial({ color: 'skyblue' }),
  new THREE.MeshPhongMaterial({ color: 'skyblue' }),
  new THREE.MeshPhongMaterial({ color: 'skyblue' })
];

// Function to create a texture from text
const createTextTexture = (label, value) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = 256;
  canvas.height = 256;
  
  // Create gradient (vertical gradient from top to bottom)
  let grd = context.createLinearGradient(0, 0, 0, canvas.height);
  grd.addColorStop(0, 'purple'); // start with purple
  grd.addColorStop(1, 'skyblue'); // end with skyblue

    // Set the background color to orange
    context.fillStyle = grd;
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
const createTextTextureTop = (label, value) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = 256;
  canvas.height = 256;
  
  // Create gradient (vertical gradient from top to bottom)
  let grd = context.createLinearGradient(0, 0, 0, canvas.height);
  grd.addColorStop(0, 'purple'); // start with purple
  grd.addColorStop(1, 'skyblue'); // end with skyblue

    // Set the background color to orange
    context.fillStyle = 'purple';
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

// const createDateTexture = (label) => {
//   const canvas = document.createElement('canvas');
//   const context = canvas.getContext('2d');

//   canvas.width = 256;
//   canvas.height = 256;

//     // Set the background color to orange
//     context.fillStyle = 'purple';
//     context.fillRect(0, 0, canvas.width, canvas.height);

//   context.fillStyle = 'black';
//   context.font = '32px Ropa Sans';
//   context.textAlign = 'center';
//   context.textBaseline = 'middle';
 
//   // Date
//   context.fillText(label, 128, 128);

//   return new THREE.CanvasTexture(canvas);
// };


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
camera.position.z = 25
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



// Timeline magic
const tl = gsap.timeline({ defaults: { duration: 1 } })
tl.fromTo(cube.scale, {z:0, x:0, y:0}, {z:1, x:1, y:1})
tl.fromTo('nav', {y: "-100%" }, { y: "0%" })
// tl.fromTo(".title", { opacity: 0 }, { opacity: 1 })

const loop = () => {

 controls.update()
 renderer.render(scene, camera)
 window.requestAnimationFrame(loop)
}
loop()

// Function to create a texture from regular text
const createRegularTextTextureTwo = (text) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = 256;
  canvas.height = 256;

      // Set the background color to orange
      context.fillStyle = 'skyblue';
      context.fillRect(0, 0, canvas.width, canvas.height);

  // Set background and text properties for regular text
  context.fillStyle = 'black'; // Black background
  context.font = '32px Ropa Sans';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, 128, 128);

  return new THREE.CanvasTexture(canvas);
};

const regularTextTwo = "₿";
const regularTextTextureTwo = createRegularTextTextureTwo(regularTextTwo);
materials[3].map = regularTextTextureTwo; // Apply to a different face,
materials[3].needsUpdate = true;

// Function to create a texture from regular text
const createRegularTextTextureTop = (text) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = 256;
  canvas.height = 256;

      // Set the background color to orange
      context.fillStyle = 'purple';
      context.fillRect(0, 0, canvas.width, canvas.height);

  // Set background and text properties for regular text
  context.fillStyle = 'black'; // Black background
  context.font = '32px Ropa Sans';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, 128, 128);

  return new THREE.CanvasTexture(canvas);
};

const regularTextTop = "";
const regularTextTextureTop = createRegularTextTextureTop(regularTextTop);
materials[2].map = regularTextTextureTop; // Apply to a different face,
materials[2].needsUpdate = true;


/// =========================== ///
// Function to fetch and update block height
const fetchAndUpdateBlockHeight = () => {
  fetch('https://mempool.space/api/blocks/tip/height')
    .then(response => response.text())
    .then(blockHeight => {
      // console.log("Block Height:", blockHeight);
      const texture = createTextTexture("Block Height", `${blockHeight}`);
      materials[4].map = texture; // Update a specific face with block height
      materials[4].needsUpdate = true;
      
    })
    .catch(console.error);
};

// Function to fetch and update mempool count
const fetchAndUpdateMempoolCount = async () => {
  fetch('https://mempool.space/api/mempool/txids')
    .then(response => response.json())
    .then(txids => {
      const mempoolCount = txids.length; // Assuming txids is an array of transaction IDs
      console.log("Mempool Count:", mempoolCount); 
      const texture = createTextTexture("Mempool Count", `${mempoolCount}`);
      materials[5].map = texture; // Update another specific face with mempool count
      materials[5].needsUpdate = true;
    })
    .catch(console.error);
};
// Call the functions to update the cube initially and periodically
fetchAndUpdateBlockHeight();
fetchAndUpdateMempoolCount();
setInterval(fetchAndUpdateBlockHeight, 5000); // Update every 15 seconds or as needed
setInterval(fetchAndUpdateMempoolCount, 5000); // Update every 15 seconds or as needed

/// Function to fetch and update recommended fees
const fetchAndUpdateRecommendedFees = () => {
  fetch('https://mempool.space/api/v1/fees/recommended')
    .then(response => response.json())
    .then(fees => {
      // console.log("Recommended Fees:", fees); 

      const feesText = `Hi: ${fees.fastestFee} \nLo: ${fees.hourFee}`;
      const texture = createTextTexture("Fees - Sats/vB", feesText);
      
      materials[1].map = texture; // Apply to a different face
      materials[1].needsUpdate = true;
    })
    .catch(console.error);
};

// Initial fetch and periodic updates
fetchAndUpdateRecommendedFees();
setInterval(fetchAndUpdateRecommendedFees, 6000); // Update every minute

// Function to fetch and update the average time
const fetchAndUpdateTimeAvg = () => {
  fetch('https://mempool.space/api/v1/difficulty-adjustment')
    .then(response => response.json())
    .then(difficultyData => {
      // console.log("Difficulty Data:", difficultyData);

      const timeAvgMilliseconds = difficultyData.timeAvg; // Get the timeAvg in milliseconds
      const timeAvgSeconds = timeAvgMilliseconds / 1000; // Convert milliseconds to seconds
      const minutes = Math.floor(timeAvgSeconds / 60); // Calculate minutes
      const seconds = Math.floor(timeAvgSeconds % 60); // Calculate remaining seconds

      // Formatting to Xm Ys style
      const formattedTime = `${minutes}m ${seconds.toString().padStart(2, '0')}s`;

      // Create the display text
      const displayText = `${formattedTime}`;
      const texture = createTextTexture("Avg Block Time", displayText);

      materials[0].map = texture; // Update the appropriate face of the cube
      materials[0].needsUpdate = true;
    })
    .catch(console.error);
};

// Initial fetch and periodic updates
fetchAndUpdateTimeAvg();
setInterval(fetchAndUpdateTimeAvg, 5000); // Time interval


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
