import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { Weapon } from './Weapon.js';

// ─── SCENE ────────────────────────────────────────────────────────────────────
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 1000);
camera.position.set(-17.498, 0.842, 3.014);
scene.add(camera);

const canvas = document.querySelector('#game-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const sun = new THREE.DirectionalLight(0xffffff, 1.5);
sun.position.set(50, 100, 50);
scene.add(sun);

// ─── POINTER LOCK ─────────────────────────────────────────────────────────────
let isLocked = false;
const blocker = document.querySelector('#blocker');

document.querySelector('#instructions').addEventListener('click', () => {
    canvas.requestPointerLock();
});

document.addEventListener('pointerlockchange', () => {
    isLocked = document.pointerLockElement === canvas;
    blocker.style.display = isLocked ? 'none' : 'flex';
});

// ─── INPUT ────────────────────────────────────────────────────────────────────
const keys = { w: false, a: false, s: false, d: false };
const mouse = { dx: 0, dy: 0 };

document.addEventListener('keydown', e => {
    if (e.code === 'KeyW') keys.w = true;
    if (e.code === 'KeyA') keys.a = true;
    if (e.code === 'KeyS') keys.s = true;
    if (e.code === 'KeyD') keys.d = true;
});
document.addEventListener('keyup', e => {
    if (e.code === 'KeyW') keys.w = false;
    if (e.code === 'KeyA') keys.a = false;
    if (e.code === 'KeyS') keys.s = false;
    if (e.code === 'KeyD') keys.d = false;
});
document.addEventListener('mousemove', e => {
    if (!isLocked) return;
    mouse.dx += e.movementX || 0;
    mouse.dy += e.movementY || 0;
});

// ─── CAMERA ROTATION STATE ────────────────────────────────────────────────────
let yaw = 0;   // left/right
let pitch = 0; // up/down

// ─── PHYSICS ──────────────────────────────────────────────────────────────────
const vel = new THREE.Vector3();
const SPEED = 0.005;
const GRAVITY = 0.003;
const FLOOR_Y = 0.842;
let canJump = true;

document.addEventListener('keydown', e => {
    if (e.code === 'Space' && canJump) {
        vel.y = 0.08;
        canJump = false;
    }
});

// ─── WEAPON ───────────────────────────────────────────────────────────────────
const weapon = new Weapon(camera);
document.addEventListener('mousedown', e => {
    if (isLocked && e.button === 0) weapon.shoot();
});

// ─── DEBUG OVERLAY ────────────────────────────────────────────────────────────
const dbg = document.createElement('div');
Object.assign(dbg.style, {
    position: 'fixed', top: '10px', left: '10px',
    color: '#0f0', background: 'rgba(0,0,0,0.7)',
    padding: '8px', fontFamily: 'monospace', fontSize: '12px',
    zIndex: '9999', pointerEvents: 'none'
});
document.body.appendChild(dbg);

// ─── LOAD ASSETS ──────────────────────────────────────────────────────────────
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

weapon.load().then(() => {
    gltfLoader.load('../map.glb', gltf => {
        scene.add(gltf.scene);
        document.querySelector('#loading-screen').style.display = 'none';
    }, undefined, err => console.error('Map load error:', err));
});

// ─── MAIN LOOP ────────────────────────────────────────────────────────────────
function animate() {
    requestAnimationFrame(animate);

    if (isLocked) {
        // Mouse look — manual yaw/pitch to avoid PointerLockControls dependency
        const sensitivity = 0.002;
        yaw   -= mouse.dx * sensitivity;
        pitch -= mouse.dy * sensitivity;
        pitch = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, pitch));
        mouse.dx = 0;
        mouse.dy = 0;

        // Build look direction from yaw/pitch
        camera.rotation.order = 'YXZ';
        camera.rotation.y = yaw;
        camera.rotation.x = pitch;

        // Movement — get forward/right vectors in XZ plane
        const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
        const right   = new THREE.Vector3( Math.cos(yaw), 0, -Math.sin(yaw));

        const move = new THREE.Vector3();
        if (keys.w) move.addScaledVector(forward, SPEED);
        if (keys.s) move.addScaledVector(forward, -SPEED);
        if (keys.a) move.addScaledVector(right, -SPEED);
        if (keys.d) move.addScaledVector(right, SPEED);

        camera.position.add(move);

        // Gravity
        vel.y -= GRAVITY;
        camera.position.y += vel.y;

        if (camera.position.y <= FLOOR_Y) {
            camera.position.y = FLOOR_Y;
            vel.y = 0;
            canJump = true;
        }

        // Weapon
        const isMoving = keys.w || keys.a || keys.s || keys.d;
        weapon.update({ x: 0, y: 0 }, isMoving);

        dbg.innerHTML =
            `LOCKED: ${isLocked}<br>` +
            `KEYS: W:${keys.w} A:${keys.a} S:${keys.s} D:${keys.d}<br>` +
            `POS: X:${camera.position.x.toFixed(3)} Y:${camera.position.y.toFixed(3)} Z:${camera.position.z.toFixed(3)}<br>` +
            `YAW: ${yaw.toFixed(2)} PITCH: ${pitch.toFixed(2)}`;
    }

    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
