import * as THREE from 'three';

const scene = new THREE.scene();
const camera = new THREE.Perspectivecamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const reneder = new THREE.WebGlRenderer();

// Geometry, mesh and material 

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);


scene.add(cube);
camera.position.z = 5;
scene.add(camera);
reneder.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(reneder.domElement);



