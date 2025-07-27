import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
camera.position.z = 1;

const canvas = document.querySelector('#monster');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

// Load Mind Flayer image
const loader = new THREE.TextureLoader();
loader.load('mind_flayer.png', (texture) => {
  texture.minFilter = THREE.LinearFilter;

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uTexture: { value: texture },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform sampler2D uTexture;
      varying vec2 vUv;

      void main() {
        vec2 uv = vUv;

        // Gentle vertical hover
        uv.y += sin(uTime * 0.5) * 0.005;

        // Gentle horizontal drift
        uv.x += cos(uTime * 0.3) * 0.003;

        gl_FragColor = texture2D(uTexture, uv);
      }
    `,
  });

  const geometry = new THREE.PlaneGeometry(2, 2);
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Animate
  const clock = new THREE.Clock();
  function animate() {
    material.uniforms.uTime.value = clock.getElapsedTime();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
});
