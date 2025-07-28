import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';

let scene, camera, renderer, material, clock;
const canvas = document.querySelector('#monster');
let clouds = [];
let lightning, lightningTimer = 0;

init();
loadAssets();
animate();

function init() {
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    createCamera();
    window.addEventListener('resize', onWindowResize);
    lightning = new THREE.PointLight(0x00ccff, 0, 15);
    scene.add(lightning);
    clock = new THREE.Clock();
}

function createCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    const frustumHeight = 2;
    const frustumWidth = frustumHeight * aspect;
    camera = new THREE.OrthographicCamera(
        -frustumWidth / 2,
        frustumWidth / 2,
        frustumHeight / 2,
        -frustumHeight / 2,
        0.1,
        10
    );
    camera.position.z = 1;
}

function loadAssets() {
    const loader = new THREE.TextureLoader();
    loader.load('cloud_red.png', (cloudTex) => {
        cloudTex.wrapS = cloudTex.wrapT = THREE.RepeatWrapping;
        cloudTex.minFilter = THREE.LinearFilter;
        for (let i = 0; i < 5; i++) {
            const material = new THREE.MeshBasicMaterial({
                map: cloudTex,
                color: 0xff3333,
                opacity: 0.25,
                transparent: true,
                depthWrite: false,
            });
            const cloudGeo = new THREE.PlaneGeometry(3, 2);
            const cloudMesh = new THREE.Mesh(cloudGeo, material);
            cloudMesh.position.set(
                Math.random() * 2 - 1,
                Math.random() * 1.5 - 0.75,
                -0.6 - Math.random() * 0.3
            );
            cloudMesh.userData.speed = 0.001 + Math.random() * 0.001;
            scene.add(cloudMesh);
            clouds.push(cloudMesh);
        }
    });

    loader.load('mind_flayer.png', (texture) => {
        texture.minFilter = THREE.LinearFilter;
        material = new THREE.ShaderMaterial({
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
                    uv.y += sin(uTime * 0.5) * 0.005;
                    uv.x += cos(uTime * 0.3) * 0.003;
                    vec4 texColor = texture2D(uTexture, uv);
                    if (texColor.a < 0.1) discard;
                    gl_FragColor = texColor;
                }
            `,
            transparent: true,
        });
        const aspect = window.innerWidth / window.innerHeight;
        const planeHeight = 1.2;
        const planeWidth = planeHeight * aspect;
        const geometry = new THREE.PlaneGeometry(planeWidth * 0.5, planeHeight);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, 0, 0);
        scene.add(mesh);
    });
}

function animate() {
    requestAnimationFrame(animate);
    if (material) {
        material.uniforms.uTime.value = clock.getElapsedTime();
    }
    clouds.forEach(cloud => {
        cloud.position.x += cloud.userData.speed;
        if (cloud.position.x > 2) cloud.position.x = -2;
    });
    lightningTimer -= 0.016;
    if (lightningTimer <= 0) {
        const flash = Math.random() > 0.92;
        lightning.intensity = flash ? 2 + Math.random() * 2 : 0;
        lightning.position.set(
            Math.random() * 2 - 1,
            Math.random() * 1.5 - 0.75,
            0
        );
        lightningTimer = 0.1;
    }
    renderer.render(scene, camera);
}

function onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;
    const frustumHeight = 2;
    const frustumWidth = frustumHeight * aspect;
    camera.left = -frustumWidth / 2;
    camera.right = frustumWidth / 2;
    camera.top = frustumHeight / 2;
    camera.bottom = -frustumHeight / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}