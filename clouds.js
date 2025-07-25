let scene = new THREE.Scene();
let camera = new THREE.OrthographicCamera(
  window.innerWidth / -2,
  window.innerWidth / 2,
  window.innerHeight / 2,
  window.innerHeight / -2,
  1,
  1000
);
camera.position.z = 1;

let renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#clouds"), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffe6f0); // soft pink

// Load the sky image as a texture
const loader = new THREE.TextureLoader();
loader.load('./cloud3.jpg', (texture) => {
  texture.minFilter = THREE.LinearFilter;

  const material = new THREE.MeshBasicMaterial({ map: texture });
  const geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Fade-in animation
  mesh.material.opacity = 0;
  mesh.material.transparent = true;
  gsap.to(mesh.material, {
    opacity: 1,
    duration: 2
  });

  // Animate zoom or slight movement
  function animate() {
    requestAnimationFrame(animate);

    // Slight zoom-in effect
    mesh.scale.x += 0.0005;
    mesh.scale.y += 0.0005;

    renderer.render(scene, camera);
  }

  animate();
});
