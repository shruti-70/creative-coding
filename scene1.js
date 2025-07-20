// alert('test')
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight, 0.1, 100);
camera.position.z = 5;
scene.add(camera);


let mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: "green"})
);

scene.add(mesh);

let renderer = new THREE.WebGLRenderer({canvas: document.querySelector("#cube")});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);