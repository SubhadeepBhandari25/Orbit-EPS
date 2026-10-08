/**
 * ORBIT-EPS: 3D Electrical Power System Simulator
 * James Webb Space Telescope Educational Simulator
 * 
 * Main application orchestrator
 * Coordinates scene, JWST model, power system, and UI components
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/controls/OrbitControls.js';
import { createScene, updateScene } from './scene.js';
import { createJWST, getJWSTMesh } from './jwst.js';
import { initPowerSystem, updatePowerSystem, getPowerSystemState } from './powerSystem.js';
import { updateHUD, showBiodata, closeBiodata } from './ui.js';
import { initChatbot } from './chatbot.js';

// Global application state
let app = {
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    jwst: null,
    powerSystem: null,
    raycaster: new THREE.Raycaster(),
    mouse: new THREE.Vector2(),
    isEclipse: false,
    loadPower: 300,
    lastFrameTime: Date.now(),
    frameCount: 0,
    fps: 60,
};

/**
 * Initialize the application
 */
export async function initApp() {
    console.log('🚀 Initializing ORBIT-EPS Application...');
    const debugEl = document.getElementById('debug-message');
    
    try {
        // Setup THREE.js scene
        console.log('🔧 Setting up Three.js...');
        if (debugEl) debugEl.textContent = 'Setting up Three.js...';
        setupThreeJS();

        // Create scene and starfield
        console.log('🌟 Creating starfield...');
        if (debugEl) debugEl.textContent = 'Creating starfield...';
        createScene(app.scene);

        // TEST: Add a simple visible cube to verify rendering
        const testGeom = new THREE.BoxGeometry(5, 5, 5);
        const testMat = new THREE.MeshBasicMaterial({ color: 0xff0000, emissive: 0xff0000 });
        const testCube = new THREE.Mesh(testGeom, testMat);
        testCube.position.set(0, 0, 0);
        app.scene.add(testCube);
        console.log('🔴 TEST CUBE added at origin (RED, 5x5x5, MeshBasicMaterial)');
        console.log('   Scene now has', app.scene.children.length, 'children');

        // Create JWST model
        console.log('🛰️ Creating JWST model...');
        if (debugEl) debugEl.textContent = 'Creating JWST model...';
        createJWST(app.scene);
        app.jwst = getJWSTMesh();
        
        // Ensure JWST is visible
        if (app.jwst) {
            app.jwst.visible = true;
            app.jwst.traverse((child) => {
                if (child.isMesh) {
                    child.visible = true;
                    child.frustumCulled = false;
                }
            });
            
            console.log('✅ JWST model created:', app.jwst.name);
            console.log('🔍 JWST Details:', {
                position: `(${app.jwst.position.x}, ${app.jwst.position.y}, ${app.jwst.position.z})`,
                scale: `(${app.jwst.scale.x}, ${app.jwst.scale.y}, ${app.jwst.scale.z})`,
                visible: app.jwst.visible,
                children: app.jwst.children.length,
                castShadow: app.jwst.castShadow,
                receiveShadow: app.jwst.receiveShadow
            });
            if (debugEl) debugEl.textContent = `JWST loaded: ${app.jwst.children.length} components (Scaled 4x)`;
            
            // Log all child components
            console.log('📦 JWST Components:');
            app.jwst.children.forEach((child, idx) => {
                console.log(`  [${idx}] ${child.name}: visible=${child.visible}, children=${child.children.length}`);
            });
        } else {
            console.error('❌ JWST model failed to create');
            if (debugEl) debugEl.textContent = 'ERROR: JWST failed to create';
        }

        // Initialize power system
        console.log('⚡ Initializing power system...');
        if (debugEl) debugEl.textContent = 'Initializing power system...';
        app.powerSystem = initPowerSystem();

        // Setup event listeners
        setupEventListeners();

        // Initialize chatbot
        initChatbot();

        // Start animation loop
        console.log('🎬 Starting animation loop...');
        if (debugEl) debugEl.textContent = 'Starting animation...';
        
        // Diagnostic: Log scene state
        setTimeout(() => {
            console.log('📊 Scene Diagnostic:');
            console.log('  Scene children:', app.scene.children.length);
            console.log('  JWST in scene:', app.jwst ? 'YES' : 'NO');
            console.log('  JWST visible:', app.jwst ? app.jwst.visible : 'N/A');
            console.log('  Camera position:', `(${app.camera.position.x}, ${app.camera.position.y}, ${app.camera.position.z})`);
            console.log('  Camera looking at:', '(0, 0, 0)');
            
            // Check if JWST can be seen from camera
            if (app.jwst) {
                const jwstWorldPos = new THREE.Vector3().setFromMatrixPosition(app.jwst.matrixWorld);
                const cameraToJWST = jwstWorldPos.clone().sub(app.camera.position);
                const distance = cameraToJWST.length();
                console.log('  JWST world position:', jwstWorldPos);
                console.log('  Distance from camera:', distance.toFixed(2), 'units');
                console.log('  JWST is', distance < 500 ? '✅ VISIBLE' : '❌ TOO FAR');
            }
        }, 500);
        
        animate();

        console.log('✅ ORBIT-EPS Ready for Operation');
        setTimeout(() => {
            if (debugEl) debugEl.style.display = 'none';
        }, 3000);
    } catch (error) {
        console.error('❌ Initialization error:', error);
        if (debugEl) debugEl.textContent = `ERROR: ${error.message}`;
    }
}

/**
 * Setup Three.js renderer and camera
 */
function setupThreeJS() {
    const container = document.getElementById('canvas-container');
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    console.log('🖥️ Setting up Three.js WebGL renderer...');
    console.log('   Container:', container);
    console.log('   Size:', width, 'x', height);
    
    if (!container) {
        throw new Error('Canvas container not found!');
    }

    // Renderer
    app.renderer = new THREE.WebGLRenderer({
        antialias: true,
        precision: 'highp',
        stencil: true,
        preserveDrawingBuffer: false,
    });
    app.renderer.setSize(width, height);
    app.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    app.renderer.outputColorSpace = THREE.SRGBColorSpace;
    app.renderer.toneMapping = THREE.LinearToneMapping;
    app.renderer.toneMappingExposure = 1.0;
    app.renderer.shadowMap.enabled = true;
    app.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    container.appendChild(app.renderer.domElement);
    
    console.log('✅ WebGL Renderer created:', {
        webglVersion: app.renderer.getContext().getVersion(),
        canvasResolution: `${width}x${height}`,
        pixelRatio: window.devicePixelRatio
    });

    // Scene
    app.scene = new THREE.Scene();
    app.scene.background = new THREE.Color(0x111111);  // Brighter for debugging
    app.scene.fog = new THREE.FogExp2(0x0a0e27, 0.00001);

    console.log('🎬 Scene created with background:', {
        background: '0x111111',
        children: app.scene.children.length
    });

    // Camera
    app.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100000);
    app.camera.position.set(0, 50, 120);
    app.camera.lookAt(0, 0, 0);
    
    console.log('📷 Camera setup:', {
        position: app.camera.position,
        aspect: width / height,
        fov: 75
    });

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    app.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
    sunLight.position.set(100, 50, 100);
    sunLight.castShadow = true;
    sunLight.shadow.camera.left = -300;
    sunLight.shadow.camera.right = 300;
    sunLight.shadow.camera.top = 300;
    sunLight.shadow.camera.bottom = -300;
    sunLight.shadow.camera.far = 1000;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    app.scene.add(sunLight);
    app.scene.sunLight = sunLight; // Store for eclipse control

    // OrbitControls
    app.controls = new OrbitControls(app.camera, app.renderer.domElement);
    app.controls.enableDamping = true;
    app.controls.dampingFactor = 0.05;
    app.controls.autoRotate = false;
    app.controls.autoRotateSpeed = 0;
    app.controls.enableZoom = true;
    app.controls.zoomSpeed = 2;
    app.controls.minDistance = 30;
    app.controls.maxDistance = 500;
    app.controls.enablePan = true;
    app.controls.panSpeed = 1;

    // Expose globally for debugging
    window.THREE = THREE;
    window.app = app;
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Window resize
    window.addEventListener('resize', onWindowResize);

    // Raycasting for JWST click detection
    document.addEventListener('click', onCanvasClick);

    // Chatbot input
    document.getElementById('chatbot-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatbotMessage();
        }
    });
}

/**
 * Handle window resize
 */
function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    app.camera.aspect = width / height;
    app.camera.updateProjectionMatrix();
    app.renderer.setSize(width, height);
}

/**
 * Handle canvas click for JWST selection
 */
function onCanvasClick(event) {
    // Don't raycast if clicking on UI elements
    if (
        event.target.id === 'chatbot-input' ||
        event.target.closest('.hud-panel') ||
        event.target.closest('.control-panel') ||
        event.target.closest('.chatbot-header') ||
        event.target.closest('button')
    ) {
        return;
    }

    const rect = app.renderer.domElement.getBoundingClientRect();
    app.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    app.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    app.raycaster.setFromCamera(app.mouse, app.camera);

    if (app.jwst) {
        const intersects = app.raycaster.intersectObject(app.jwst, true);
        if (intersects.length > 0) {
            showBiodata();
            console.log('📡 JWST selected via raycasting');
        }
    }
}

/**
 * Main animation loop
 */
function animate() {
    requestAnimationFrame(animate);

    // Update time-dependent systems
    const currentTime = Date.now();
    const deltaTime = (currentTime - app.lastFrameTime) / 1000;
    app.lastFrameTime = currentTime;

    // Update power system with current load
    const powerState = updatePowerSystem(deltaTime, app.loadPower, app.isEclipse);

    // Update scene animations
    updateScene(app.scene, currentTime);

    // Update HUD with current values
    updateHUD(powerState, app.isEclipse);

    // Update controls
    app.controls.update();

    // Render
    app.renderer.render(app.scene, app.camera);

    // Update FPS counter
    updatePerformanceMetrics();
}

/**
 * Update performance metrics
 */
function updatePerformanceMetrics() {
    app.frameCount++;
    const now = performance.now();
    
    if (!app.lastFPSUpdate) {
        app.lastFPSUpdate = now;
    }

    if (now >= app.lastFPSUpdate + 1000) {
        app.fps = Math.round(app.frameCount);
        document.getElementById('fps-counter').textContent = `FPS: ${app.fps}`;
        
        // Estimate memory usage
        if (performance.memory) {
            const mb = (performance.memory.usedJSHeapSize / 1048576).toFixed(1);
            document.getElementById('memory-counter').textContent = `RAM: ${mb} MB`;
        }

        app.frameCount = 0;
        app.lastFPSUpdate = now;
    }
}

/**
 * Global function for eclipse toggle
 */
window.toggleEclipse = function() {
    app.isEclipse = !app.isEclipse;
    const sunLight = app.scene.sunLight;
    
    if (app.isEclipse) {
        sunLight.intensity = 0;
        console.log('🌑 ECLIPSE MODE: Sunlight disabled');
    } else {
        sunLight.intensity = 0.8;
        console.log('☀️ SUNLIGHT MODE: Sunlight enabled');
    }
};

/**
 * Global function for load slider
 */
window.updateLoad = function() {
    const slider = document.getElementById('load-slider');
    app.loadPower = parseInt(slider.value);
    document.getElementById('load-display').textContent = `${app.loadPower} W`;
};

/**
 * Global function for solar panel deployment
 */
window.deploySolarPanel = function() {
    const btn = document.getElementById('solar-deploy-btn');
    if (btn.textContent.includes('Deploy')) {
        btn.textContent = 'Retract Solar Panel';
        // TODO: Add animation
        console.log('🔧 Solar panel deployed');
    } else {
        btn.textContent = 'Deploy Solar Panel';
        console.log('🔧 Solar panel retracted');
    }
};

/**
 * Global function for simulation reset
 */
window.resetSimulation = function() {
    app.isEclipse = false;
    document.getElementById('eclipse-toggle').checked = false;
    app.scene.sunLight.intensity = 0.8;
    document.getElementById('load-slider').value = 300;
    app.loadPower = 300;
    document.getElementById('load-display').textContent = '300 W';
    document.getElementById('solar-deploy-btn').textContent = 'Deploy Solar Panel';
    console.log('🔄 Simulation reset');
};

/**
 * Global functions for UI
 */
window.closeBiodata = closeBiodata;
window.toggleChatbot = function() {
    const panel = document.getElementById('chatbot-panel');
    const messages = panel.querySelector('.chatbot-messages');
    const inputArea = panel.querySelector('.chatbot-input-area');
    
    if (messages.style.display === 'none') {
        messages.style.display = 'flex';
        inputArea.style.display = 'flex';
    } else {
        messages.style.display = 'none';
        inputArea.style.display = 'none';
    }
};

window.sendChatbotMessage = function() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();
    
    if (message) {
        import('./chatbot.js').then(module => {
            module.processChatbotMessage(message);
        });
        input.value = '';
    }
};

// Start application
console.log('%c🌌 ORBIT-EPS v1.0 - JWST Electrical Power System Simulator', 'color: #00d9ff; font-size: 16px; font-weight: bold;');
console.log('📦 THREE module:', typeof THREE);
console.log('🎮 OrbitControls:', typeof OrbitControls);

initApp().catch(err => {
    console.error('❌ Failed to initialize ORBIT-EPS:', err);
    document.getElementById('debug-message').textContent = `ERROR: ${err.message}`;
});
