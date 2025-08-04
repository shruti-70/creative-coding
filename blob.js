// Ensure THREE.js is loaded before this script is run

// Import required libraries (Simplex noise for organic movement)
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js';

let scene, camera, renderer, blob, clock;
const noise = new SimplexNoise();

init();
animate();

function init() {
  // Create the scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111111);

  // Create a camera (Perspective)
  camera = new THREE.PerspectiveCamera(
    60, // field of view
    window.innerWidth / window.innerHeight, // aspect ratio
    0.1, // near clipping
    1000 // far clipping
  );
  camera.position.z = 5;

  // Set up the renderer
  renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#blob') });
  renderer.setSize(window.innerWidth, window.innerHeight);
  // Add orbit controls (optional, for mouse interaction)
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Create geometry (starting with a sphere)
  const geometry = new THREE.IcosahedronGeometry(1.5, 32); // More subdivisions = smoother deformation

  // Create a basic material
  const material = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    roughness: 0.4,
    metalness: 0.1,
    flatShading: true,
  });

  // Create the mesh (our blob)
  blob = new THREE.Mesh(geometry, material);
  scene.add(blob);

  // Add lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  // Set up clock for timing
  clock = new THREE.Clock();

  // Handle resize
  window.addEventListener('resize', onWindowResize);
}

// Update geometry vertices using noise for organic movement
function updateBlobGeometry() {
  const time = clock.getElapsedTime();

  // Access the geometry and its original vertices
  const geometry = blob.geometry;
  geometry.computeVertexNormals();

  for (let i = 0; i < geometry.attributes.position.count; i++) {
    const x = geometry.attributes.position.getX(i);
    const y = geometry.attributes.position.getY(i);
    const z = geometry.attributes.position.getZ(i);

    // Normalize direction vector
    const vertex = new THREE.Vector3(x, y, z).normalize();

    // Use noise to alter the radius slightly over time
    const noiseFactor = noise.noise4d(
      vertex.x * 1.5,
      vertex.y * 1.5,
      vertex.z * 1.5,
      time * 0.5
    );

    const radius = 1.5 + noiseFactor * 0.3;

    // Apply new position
    geometry.attributes.position.setXYZ(
      i,
      vertex.x * radius,
      vertex.y * radius,
      vertex.z * radius
    );
  }

  geometry.attributes.position.needsUpdate = true;
  geometry.computeVertexNormals();
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  updateBlobGeometry();

  // Rotate blob slowly for visual appeal
  blob.rotation.y += 0.002;

  renderer.render(scene, camera);
}

// Resize handler
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
