/**
 * ORBIT-EPS: Scene and Starfield
 * 
 * Manages deep-space background, starfield, and scene animations
 * Provides cinematic, realistic space environment
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';

let scene = null;
let stars = null;

/**
 * Create the space scene with starfield
 */
export function createScene(sceneRef) {
    scene = sceneRef;
    
    console.log('🌌 Creating space scene...');
    
    // Create starfield
    createStarfield();
    
    // Create deep space lighting
    setupSpaceEnvironment();
    
    console.log('✨ Space scene initialized with starfield', {
        totalObjects: scene.children.length,
        sceneBackground: scene.background,
        sceneFog: scene.fog
    });
}

/**
 * Create realistic starfield
 */
function createStarfield() {
    const starGeometry = new THREE.BufferGeometry();
    
    // Create star positions in a sphere around the origin
    const starCount = 2000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount * 3; i += 3) {
        // Random position on a sphere (deep space)
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.acos(Math.random() * 2 - 1);
        const radius = 1500; // Far distance
        
        positions[i] = radius * Math.sin(theta) * Math.cos(phi);
        positions[i + 1] = radius * Math.sin(theta) * Math.sin(phi);
        positions[i + 2] = radius * Math.cos(theta);
        
        // Star color variation (white to blue-ish)
        const colorVariation = Math.random();
        if (colorVariation < 0.7) {
            // White stars (majority)
            colors[i] = 1.0;
            colors[i + 1] = 1.0;
            colors[i + 2] = 0.9 + Math.random() * 0.1;
        } else if (colorVariation < 0.85) {
            // Blue stars
            colors[i] = 0.7 + Math.random() * 0.2;
            colors[i + 1] = 0.8 + Math.random() * 0.2;
            colors[i + 2] = 1.0;
        } else {
            // Red stars
            colors[i] = 1.0;
            colors[i + 1] = 0.6 + Math.random() * 0.2;
            colors[i + 2] = 0.4 + Math.random() * 0.1;
        }
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const starMaterial = new THREE.PointsMaterial({
        size: 0.8,
        vertexColors: true,
        sRGBColorSpace: true,
        fog: false,
    });
    
    stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
}

/**
 * Setup space environment lighting and atmosphere
 */
function setupSpaceEnvironment() {
    // Subtle background gradient via fog
    scene.fog = new THREE.FogExp2(0x0a0e27, 0.00001);
    
    // Add a faint nebula glow in background (using a large sphere with shader)
    const nebulaSphere = createNebulaGlow();
    if (nebulaSphere) {
        scene.add(nebulaSphere);
    }
}

/**
 * Create a subtle nebula glow effect
 */
function createNebulaGlow() {
    const geometry = new THREE.SphereGeometry(2000, 32, 32);
    
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Create a radial gradient nebula texture
    const gradient = ctx.createRadialGradient(256, 256, 100, 256, 256, 512);
    gradient.addColorStop(0, 'rgba(100, 150, 200, 0.3)');
    gradient.addColorStop(0.5, 'rgba(50, 80, 150, 0.1)');
    gradient.addColorStop(1, 'rgba(10, 14, 39, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        fog: false,
        transparent: true,
    });
    
    const nebula = new THREE.Mesh(geometry, material);
    return nebula;
}

/**
 * Update scene animations (starfield twinkling, etc.)
 */
export function updateScene(sceneRef, time) {
    // Optional: Add subtle star twinkling
    if (stars && stars.material) {
        // Could add pulsating effect here if desired
        // Currently kept static for exam clarity
    }
}

/**
 * Get star field mesh (for modification if needed)
 */
export function getStars() {
    return stars;
}
