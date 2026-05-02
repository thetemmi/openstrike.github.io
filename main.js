import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

// Display errors on screen for debugging
window.addEventListener('error', (e) => {
    const errorDiv = document.createElement('div');
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '10px';
    errorDiv.style.left = '10px';
    errorDiv.style.color = 'red';
    errorDiv.style.background = 'black';
    errorDiv.style.padding = '10px';
    errorDiv.style.zIndex = '9999';
    errorDiv.innerText = 'ERROR: ' + e.message;
    document.body.appendChild(errorDiv);
});

// Final Cinematic Configuration
const CONFIG = {
    modelPaths: {
        map: './map.glb',
        terrorist: './terrorist.glb',
        awp: './awp.glb'
    },
    camera: {
        fov: 45,
        pos: new THREE.Vector3(-17.407, 0.842, 3.108),
        lookAt: new THREE.Vector3(-17.500, 0.820, 3.014)
    }
};

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.FogExp2(0x87ceeb, 0.01);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.copy(CONFIG.camera.pos);
camera.lookAt(CONFIG.camera.lookAt);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg-canvas'),
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 1.2;

scene.add(new THREE.AmbientLight(0xffffff, 0.3));
const sun = new THREE.DirectionalLight(0xffffff, 2.5);
sun.position.set(50, 100, 50);
scene.add(sun);

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

let character = null;

// Load Models
gltfLoader.load(CONFIG.modelPaths.map, (gltf) => {
    scene.add(gltf.scene);
});

gltfLoader.load(CONFIG.modelPaths.terrorist, (gltf) => {
    character = gltf.scene;
    character.position.set(-17.498, 0.70, 3.014);
    character.scale.set(0.002, 0.002, 0.002);
    character.rotation.y = Math.PI / 4;
    scene.add(character);
    
    gltfLoader.load(CONFIG.modelPaths.awp, (weaponGltf) => {
        const weapon = weaponGltf.scene;
        const hand = character.getObjectByName('mixamorig_RightHand') || character.getObjectByName('RightHand');
        if (hand) {
            hand.add(weapon);
            weapon.scale.set(100, 100, 100);
            weapon.rotation.set(Math.PI / 2, 0, 0);
        }
    });
});

// Intro Animation
setTimeout(() => {
    const loader = document.querySelector('#loading-screen');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 800);
    }
}, 1000);

const mouse = { x: 0, y: 0 };
window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) - 0.5;
    mouse.y = (e.clientY / window.innerHeight) - 0.5;
});

function animate() {
    requestAnimationFrame(animate);

    // Subtle Parallax
    const targetCamX = CONFIG.camera.pos.x + mouse.x * 0.05;
    const targetCamY = CONFIG.camera.pos.y - mouse.y * 0.03;
    camera.position.x += (targetCamX - camera.position.x) * 0.05;
    camera.position.y += (targetCamY - camera.position.y) * 0.05;
    camera.lookAt(CONFIG.camera.lookAt);

    if (character) character.rotation.y = Math.PI / 4 + mouse.x * 0.05;

    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// UI Logic
const hostBtn = document.querySelector('#host-btn');
const joinBtn = document.querySelector('#join-btn');
const joinModal = document.querySelector('#join-modal');
const modalCancelBtn = document.querySelector('#modal-cancel-btn');
const modalConnectBtn = document.querySelector('#modal-connect-btn');
const hostIdInput = document.querySelector('#host-id-input');

if (hostBtn) {
    hostBtn.addEventListener('click', () => {
        hostBtn.style.transform = 'scale(0.95)';
        hostBtn.style.filter = 'brightness(1.5)';
        setTimeout(() => {
            window.location.href = './game/index.html?mode=host';
        }, 500);
    });
}

if (joinBtn) {
    joinBtn.addEventListener('click', () => {
        joinBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            joinBtn.style.transform = '';
            joinModal.style.display = 'flex';
            hostIdInput.focus();
        }, 100);
    });
}

if (modalCancelBtn) {
    modalCancelBtn.addEventListener('click', () => {
        joinModal.style.display = 'none';
        hostIdInput.value = '';
    });
}

if (modalConnectBtn) {
    modalConnectBtn.addEventListener('click', () => {
        const hostId = hostIdInput.value.trim();
        if (hostId) {
            window.location.href = `./game/index.html?mode=join&hostId=${encodeURIComponent(hostId)}`;
        } else {
            hostIdInput.style.borderColor = 'red';
            setTimeout(() => hostIdInput.style.borderColor = '', 1000);
        }
    });
}

document.querySelectorAll('.menu-btn').forEach(btn => {
    if (['host-btn', 'join-btn', 'modal-cancel-btn', 'modal-connect-btn'].includes(btn.id)) return; 
    btn.addEventListener('click', () => {
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => btn.style.transform = '', 100);
    });
});
