import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// --- 基礎場景設定 ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // 天空藍

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 20); // 相機位置稍微提高

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// 加入滑鼠/觸控控制
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// --- 光源 ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // 環境光
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // 太陽光
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

// --- 生成地面（道路） ---
const roadGeometry = new THREE.PlaneGeometry(20, 100); // 寬 20, 長 100
const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 }); // 深灰色
const road = new THREE.Mesh(roadGeometry, roadMaterial);
road.rotation.x = -Math.PI / 2; // 水平放置
scene.add(road);

// --- 生成建築物 ---
function createBuilding(x, z, height) {
    const geometry = new THREE.BoxGeometry(4, height, 4); // 寬 4, 深 4
    // 隨機一點建築物顏色
    const color = new THREE.Color().setHSL(Math.random(), 0.3, 0.5);
    const material = new THREE.MeshStandardMaterial({ color: color });
    const building = new THREE.Mesh(geometry, material);
    building.position.set(x, height / 2, z); // 底部對齊地面
    scene.add(building);
}

// 在街道兩旁生成建築物
const streetLength = 100;
const buildingGap = 8;
const buildingOffset = 8; // 距離街道中心的距離

for (let z = -streetLength / 2; z < streetLength / 2; z += buildingGap) {
    // 左側建築物
    const leftHeight = 10 + Math.random() * 20; // 隨機高度 10~30
    createBuilding(-buildingOffset, z, leftHeight);

    // 右側建築物
    const rightHeight = 10 + Math.random() * 20;
    createBuilding(buildingOffset, z, rightHeight);
}

// --- 生成路燈 ---
function createStreetLight(x, z) {
    const group = new THREE.Group();

    // 燈柱
    const poleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 4);
    const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.y = 2;
    group.add(pole);

    // 燈頭
    const headGeometry = new THREE.BoxGeometry(0.5, 0.2, 1);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 4;
    head.position.z = 0.4;
    group.add(head);

    // 加入實際點光源（選做，增加效能負擔）
    // const light = new THREE.PointLight(0xffff00, 1, 10);
    // light.position.set(0, 4, 0.4);
    // group.add(light);

    group.position.set(x, 0, z);
    scene.add(group);
}

// 在街道兩旁生成路燈
for (let z = -streetLength / 2 + 4; z < streetLength / 2; z += 16) {
    createStreetLight(-6, z); // 左側
    createStreetLight(6, z);  // 右側
}

// --- 動態調整視窗 ---
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// --- 動態迴圈 ---
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // 只有在 enableDamping 為 true 時才需要
    renderer.render(scene, camera);
}
animate();
