// alert('test')
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight, 0.1, 100);
camera.position.z = 5;
scene.add(camera);


let mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: "green"})
);

// mesh.position.z = -3;
// rotation, poistion and scale
// mesh.scale.z = 2;
// mesh.rotation.z = 2;
// mesh.rotation.x = Math.PI; // 180- degrees rotatation back to same position
scene.add(mesh);


let renderer = new THREE.WebGLRenderer({canvas: document.querySelector("#cube")});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

function animate(){
    window.requestAnimationFrame(animate);
    renderer.render(scene, camera);
    mesh.rotation.y+= 0.01;
}
animate();