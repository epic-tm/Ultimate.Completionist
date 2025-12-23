import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. Setup Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// 2. Data for the 7 Artifacts
const ARTIFACTS = [
    { name: "The Monolith", color: 0xFF3E3E, pos: [8, 0, 0] },    // Red
    { name: "The Cipher", color: 0x3E70FF, pos: [5, 3, 5] },    // Blue
    { name: "The Forge", color: 0xFFD700, pos: [0, 0, 8] },     // Yellow
    { name: "The Catalyst", color: 0x32CD32, pos: [-5, 3, 5] }, // Green
    { name: "The Sovereign", color: 0x00CED1, pos: [-8, 0, 0] },// Cyan
    { name: "The Horizon", color: 0xFF8C00, pos: [-5, -3, -5] },// Orange
    { name: "The Zenith", color: 0x9370DB, pos: [0, 8, 0] }     // Purple
];

// 3. Create Stars (Background)
const starGeometry = new THREE.BufferGeometry();
const starCount = 5000;
const posArray = new Float32Array(starCount * 3);
for(let i = 0; i < starCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 200;
}
starGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const starMaterial = new THREE.PointsMaterial({ size: 0.1, color: 0xFFFFFF });
const starMesh = new THREE.Points(starGeometry, starMaterial);
scene.add(starMesh);

// 4. Create the Artifacts
const soulNodes = [];
ARTIFACTS.forEach(data => {
    const geo = new THREE.IcosahedronGeometry(0.8, 1);
    const mat = new THREE.MeshStandardMaterial({ 
        color: data.color, 
        emissive: data.color, 
        emissiveIntensity: 2,
        wireframe: true 
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...data.pos);
    mesh.userData = { name: data.name };
    scene.add(mesh);
    soulNodes.push(mesh);

    // Add a faint line connecting to center
    const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1 });
    const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(...data.pos)];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(lineGeo, lineMat);
    scene.add(line);
});

// 5. Lighting & Controls
const light = new THREE.PointLight(0xffffff, 50, 100);
light.position.set(0, 0, 0);
scene.add(light);
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 20;

// 6. Animation Loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate background and nodes
    starMesh.rotation.y += 0.0005;
    soulNodes.forEach(node => {
        node.rotation.y += 0.01;
        node.rotation.x += 0.005;
    });

    controls.update();
    renderer.render(scene, camera);
}

// 7. Handle Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
