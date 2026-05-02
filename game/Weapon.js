import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class Weapon {
    constructor(camera) {
        this.camera = camera;
        this.model = null;
        this.group = new THREE.Group();
        this.camera.add(this.group);
        
        this.config = {
            path: '../ak47.glb',
            scale: 0.005,
            pos: new THREE.Vector3(0.01, -0.01, -0.02),
            rot: new THREE.Euler(0, Math.PI + 0.1, 0),
            sway: 0.02,
            bobSpeed: 0.1,
            bobAmount: 0.01
        };

        this.bobTimer = 0;
    }

    async load() {
        const loader = new GLTFLoader();
        return new Promise((resolve) => {
            loader.load(this.config.path, (gltf) => {
                this.model = gltf.scene;
                this.model.scale.set(this.config.scale, this.config.scale, this.config.scale);
                this.model.position.copy(this.config.pos);
                this.model.rotation.copy(this.config.rot);
                
                this.model.traverse(child => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                this.group.add(this.model);
                resolve();
            });
        });
    }

    update(mouse, isMoving) {
        if (!this.model) return;

        // Weapon Sway
        const targetX = this.config.pos.x - mouse.x * this.config.sway;
        const targetY = this.config.pos.y + mouse.y * this.config.sway;
        
        this.model.position.x += (targetX - this.model.position.x) * 0.1;
        this.model.position.y += (targetY - this.model.position.y) * 0.1;

        // Weapon Bobbing
        if (isMoving) {
            this.bobTimer += this.config.bobSpeed;
            this.model.position.y += Math.sin(this.bobTimer) * this.config.bobAmount;
            this.model.position.x += Math.cos(this.bobTimer * 0.5) * this.config.bobAmount;
        } else {
            this.bobTimer = 0;
            this.model.position.y += (this.config.pos.y - this.model.position.y) * 0.05;
        }
    }

    shoot() {
        if (!this.model) return;
        
        // Kickback animation
        this.model.position.z += 0.05;
        setTimeout(() => {
            if (this.model) this.model.position.z -= 0.05;
        }, 50);
        
        // Return a ray for firing logic
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
        return raycaster;
    }
}
