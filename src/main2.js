import * as THREE from './three.module.js';
import { OrbitControls } from './OrbitControls.js';
// import { TrackballControls } from './TrackballControls.js';
import { GLTFLoader } from './GLTFLoader.js';

// ----- 주제: OrbitControls

// Renderer
const canvas = document.querySelector('#three-canvas');
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('yellow');

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 20;
camera.position.z = 10;
camera.position.x = 15;
scene.add(camera);
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
console.log(mouse);

const gltfLoader = new GLTFLoader();
let meshes = [];
gltfLoader.load('./position_blender.glb', (gltf) => {
    const mesh = gltf.scene.children[0].children[1].geometry;
    const mesh2 = gltf.scene.children[0].children[0].geometry;
    const mesh3 = gltf.scene.children[0].children[2].geometry;
    const materi = new THREE.MeshStandardMaterial({
        color: `rgb(
				0,0,0
			)`,
    });
    const materi2 = new THREE.MeshStandardMaterial({
        color: `rgb(
				0,0,0
			)`,
    });
    const materi3 = new THREE.MeshStandardMaterial({
        color: `rgb(
				0,0,0
			)`,
    });
    mesh;
    let mmm = new THREE.Mesh(mesh, materi);
    let mmm2 = new THREE.Mesh(mesh2, materi2);
    let mmm3 = new THREE.Mesh(mesh3, materi3);
    mmm.name = 'firstOBJ';
    mmm2.name = 'secondOBJ';
    meshes.push(mmm);
    meshes.push(mmm2);
    meshes.push(mmm3);

    mmm.position.z = -2;
    mmm2.position.z = -2;
    mmm3.position.z = -2;
    // console.log(mesh);
    scene.add(mmm);
    scene.add(mmm2);
    scene.add(mmm3);
});

// Light
const ambientLight = new THREE.AmbientLight('white', 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight('white', 1);
directionalLight.position.x = 1;
directionalLight.position.z = 2;
// scene.add(directionalLight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
// const controls = new TrackballControls(camera, renderer.domElement);
controls.enableDamping = true;

// controls.enableZoom = false;
controls.maxDistance = 4;
controls.minDistance = 3;
// controls.minPolarAngle = THREE.MathUtils.degToRad(120);
// controls.target.set(2, 2, 2);
// controls.minPolarAngle = THREE.MathUtils.degToRad(45);
// controls.maxPolarAngle = THREE.MathUtils.degToRad(135);
// controls.target.set(2, 2, 2);
controls.autoRotate = true;
controls.autoRotateSpeed = 0.2;

// Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);
let mesh;
let material;
for (let i = 0; i < 20; i++) {
    material = new THREE.MeshStandardMaterial({
        color: `rgb(
				${50 + Math.floor(Math.random() * 205)},
				${50 + Math.floor(Math.random() * 205)},
				${50 + Math.floor(Math.random() * 205)}
			)`,
    });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = (Math.random() - 0.5) * 5;
    mesh.position.y = (Math.random() - 0.5) * 5;
    mesh.position.z = (Math.random() - 0.5) * 5;
    // scene.add(mesh);
}

// 그리기
const clock = new THREE.Clock();

function draw() {
    const delta = clock.getDelta();

    controls.update();

    const origin = new THREE.Vector3(0, 0, 100);
    const direction = new THREE.Vector3(0, 0, -1);
    raycaster.set(origin, direction);
    // console.log(raycaster.intersectObjects(meshes));
    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
}
function checkIntersects() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(meshes);
    if (intersects.length > 0) {
        meshes.forEach((mesh) => {
            console.log(mesh.material.color);
            mesh.material.color.set('black');
            // mesh.object.material.color.set('black');
        });
    }

    for (const item of intersects) {
        item.object.material.color.set('orangered');
        const ts = document.querySelectorAll('.t');
        ts.forEach((t) => {
            t.style.display = 'none';
        });
        if (item.object.name == 'firstOBJ') {
            document.querySelector('.textInformation-1').style.display = 'block';
        } else if (item.object.name == 'secondOBJ') {
            document.querySelector('.textInformation-2').style.display = 'block';
        }
        break;
    }
}

function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
}

// 이벤트
window.addEventListener('resize', setSize);
canvas.addEventListener('click', (e) => {
    mouse.x = (e.clientX / canvas.clientWidth) * 2 - 1;
    mouse.y = -((e.clientY / canvas.clientHeight) * 2 - 1);
    // console.log(mouse);
    checkIntersects();
});
draw();
