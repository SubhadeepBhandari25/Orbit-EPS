/**
 * ORBIT-EPS: JWST 3D Model
 * 
 * Highly realistic low-poly James Webb Space Telescope model
 * Includes all major components with visual detail and optimized geometry
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';

let jwstGroup = null;
let components = {
    primaryMirror: null,
    secondaryMirror: null,
    sunshield: null,
    spacecraftBus: null,
    solarPanel: null,
    battery: null,
    powerBus: null,
    antenna: null,
};

/**
 * Create the complete JWST model - JAMES WEBB SPACE TELESCOPE
 */
export function createJWST(scene) {
    console.log('🛰️ Starting JWST creation...');
    
    jwstGroup = new THREE.Group();
    jwstGroup.name = 'JWST - James Webb Space Telescope';
    
    try {
        // Add simple test sphere first
        const testSphereGeom = new THREE.SphereGeometry(3, 32, 32);
        const testSphereMat = new THREE.MeshBasicMaterial({ color: 0xffaa00, wireframe: false });
        const testSphere = new THREE.Mesh(testSphereGeom, testSphereMat);
        testSphere.position.set(0, 0, 0);
        jwstGroup.add(testSphere);
        console.log('✅ TEST SPHERE added (ORANGE, should be visible)');
        
        // Sunshield layer (back)
        createSunshield(jwstGroup);
        
        // Main spacecraft bus
        createSpacecraftBus(jwstGroup);
        
        // Primary mirror (18 segments arranged in hexagon pattern)
        createPrimaryMirror(jwstGroup);
        
        // Secondary mirror and support struts
        createSecondaryMirror(jwstGroup);
        createSecondarySupport(jwstGroup);
        
        // Solar array (extends from bus)
        createSolarPanel(jwstGroup);
        
        // Instrument module
        createBatteryModule(jwstGroup);
        
        // Antenna and deployment mechanisms
        createAntenna(jwstGroup);
        
        // SCALE UP: Make JWST much larger so it's visible!
        // Camera is at (0, 50, 120), so we need a prominent satellite
        jwstGroup.scale.set(4, 4, 4);
        jwstGroup.position.set(0, 0, 0);
        
        // Add to scene
        scene.add(jwstGroup);
        
        console.log('🛰️ JWST model created successfully', {
            totalComponents: jwstGroup.children.length,
            position: jwstGroup.position,
            scale: jwstGroup.scale,
            visible: jwstGroup.visible
        });
    } catch(error) {
        console.error('❌ Error creating JWST:', error);
        throw error;
    }
}

/**
 * Create hexagonal segmented primary mirror (18 segments + 1 center) = REAL JWST DESIGN
 */
function createPrimaryMirror(parent) {
    const group = new THREE.Group();
    group.name = 'Primary Mirror - 18 Segments';
    
    // REAL JWST: Gold-coated beryllium segments
    const segmentRadius = 1.5;
    const goldMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,          // Real gold color
        metalness: 0.85,
        roughness: 0.15,
        emissive: 0x332200,
        emissiveIntensity: 0.15,
    });
    
    // 18 segments arranged in rings
    // Outer ring: 6 segments
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 8;
        const z = Math.sin(angle) * 8;
        
        const segment = createMirrorSegment(segmentRadius, goldMaterial);
        segment.position.set(x, 5, z);
        group.add(segment);
    }
    
    // Middle ring: 6 segments
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6 + 0.5) * Math.PI * 2;
        const x = Math.cos(angle) * 5;
        const z = Math.sin(angle) * 5;
        
        const segment = createMirrorSegment(segmentRadius, goldMaterial);
        segment.position.set(x, 5, z);
        group.add(segment);
    }
    
    // Inner ring: 6 segments
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 2.5;
        const z = Math.sin(angle) * 2.5;
        
        const segment = createMirrorSegment(segmentRadius * 0.8, goldMaterial);
        segment.position.set(x, 5, z);
        group.add(segment);
    }
    
    // Center segment
    const centerSegment = createMirrorSegment(segmentRadius, goldMaterial);
    centerSegment.position.set(0, 5, 0);
    group.add(centerSegment);
    
    group.visible = true;
    parent.add(group);
    components.primaryMirror = group;
    
    console.log(`✅ Primary Mirror created with ${group.children.length} segments`);
}

/**
 * Create a single mirror segment (hexagon)
 */
function createMirrorSegment(radius, material) {
    const geometry = new THREE.CylinderGeometry(radius, radius, 0.5, 6);
    const segment = new THREE.Mesh(geometry, material);
    segment.castShadow = true;
    segment.receiveShadow = true;
    segment.visible = true;
    return segment;
}

/**
 * Create secondary mirror
 */
function createSecondaryMirror(parent) {
    const geometry = new THREE.SphereGeometry(2, 16, 16);
    const material = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        metalness: 0.9,
        roughness: 0.1,
        emissive: 0x666666,
        emissiveIntensity: 0.2,
    });
    
    const mirror = new THREE.Mesh(geometry, material);
    mirror.position.set(0, 12, 0);
    mirror.castShadow = true;
    mirror.receiveShadow = true;
    mirror.visible = true;
    mirror.name = 'Secondary Mirror';
    
    parent.add(mirror);
    components.secondaryMirror = mirror;
    console.log('✅ Secondary Mirror created');
}

/**
 * Create secondary mirror support structure
 */
function createSecondarySupport(parent) {
    const group = new THREE.Group();
    group.name = 'Secondary Support';
    
    const supportMaterial = new THREE.MeshStandardMaterial({
        color: 0x444444,
        metalness: 0.6,
        roughness: 0.4,
    });
    
    // Create 3 support struts
    for (let i = 0; i < 3; i++) {
        const angle = (i / 3) * Math.PI * 2;
        const startX = Math.cos(angle) * 3;
        const startZ = Math.sin(angle) * 3;
        
        const strutGeometry = new THREE.CylinderGeometry(0.15, 0.15, 5, 8);
        const strut = new THREE.Mesh(strutGeometry, supportMaterial);
        strut.position.set(startX, 5.5, startZ);
        strut.castShadow = true;
        strut.receiveShadow = true;
        group.add(strut);
    }
    
    parent.add(group);
}

/**
 * Create sunshield (5 layers)
 */
function createSunshield(parent) {
    const group = new THREE.Group();
    group.name = 'Sunshield';
    
    const layerMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.3,
        roughness: 0.7,
        emissive: 0x000000,
    });
    
    // 5 heat-reflective layers
    const layerSpacing = 0.15;
    for (let i = 0; i < 5; i++) {
        const layerGeometry = new THREE.PlaneGeometry(20, 14);
        const layer = new THREE.Mesh(layerGeometry, layerMaterial);
        layer.position.set(0, -2, -12 - i * layerSpacing);
        layer.castShadow = true;
        layer.receiveShadow = true;
        group.add(layer);
    }
    
    parent.add(group);
    components.sunshield = group;
}

/**
 * Create spacecraft bus (main body)
 */
function createSpacecraftBus(parent) {
    const geometry = new THREE.BoxGeometry(4, 6, 8);
    const material = new THREE.MeshStandardMaterial({
        color: 0x2a3a4e,
        metalness: 0.5,
        roughness: 0.5,
        emissive: 0x111111,
        emissiveIntensity: 0.1,
    });
    
    const bus = new THREE.Mesh(geometry, material);
    bus.position.set(0, 0, 0);
    bus.castShadow = true;
    bus.receiveShadow = true;
    bus.visible = true;
    bus.name = 'Spacecraft Bus';
    
    parent.add(bus);
    components.spacecraftBus = bus;
    console.log('✅ Spacecraft Bus created');
}

/**
 * Create single deployable solar panel (JWST-accurate)
 */
function createSolarPanel(parent) {
    const group = new THREE.Group();
    group.name = 'Solar Panel';
    
    // Solar panel array
    const panelGeometry = new THREE.PlaneGeometry(8, 5);
    const solarMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a4d7a,
        metalness: 0.4,
        roughness: 0.6,
        emissive: 0x0033aa,
        emissiveIntensity: 0.1,
    });
    
    const panel = new THREE.Mesh(panelGeometry, solarMaterial);
    panel.position.set(8, 0, 0);
    panel.rotation.y = Math.PI / 6;
    panel.castShadow = true;
    panel.receiveShadow = true;
    group.add(panel);
    
    // Panel support arm
    const armGeometry = new THREE.CylinderGeometry(0.2, 0.2, 6, 8);
    const armMaterial = new THREE.MeshStandardMaterial({
        color: 0x444444,
        metalness: 0.7,
        roughness: 0.3,
    });
    
    const arm = new THREE.Mesh(armGeometry, armMaterial);
    arm.position.set(4, 0, 0);
    arm.rotation.z = Math.PI / 2;
    arm.castShadow = true;
    arm.receiveShadow = true;
    group.add(arm);
    
    parent.add(group);
    components.solarPanel = group;
}

/**
 * Create battery module (semi-transparent glowing cube)
 */
function createBatteryModule(parent) {
    const geometry = new THREE.BoxGeometry(1.5, 1.5, 2);
    const material = new THREE.MeshStandardMaterial({
        color: 0xff6600,
        metalness: 0.5,
        roughness: 0.4,
        emissive: 0xff3300,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.8,
    });
    
    const battery = new THREE.Mesh(geometry, material);
    battery.position.set(-1.5, 0, 0);
    battery.castShadow = true;
    battery.name = 'Battery Module';
    
    parent.add(battery);
    components.battery = battery;
}

/**
 * Create power distribution bus
 */
function createPowerBus(parent) {
    const group = new THREE.Group();
    group.name = 'Power Bus';
    
    const busGeometry = new THREE.BoxGeometry(0.4, 0.4, 2);
    const busMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        metalness: 0.7,
        roughness: 0.2,
        emissive: 0x00aa44,
        emissiveIntensity: 0.2,
    });
    
    const bus = new THREE.Mesh(busGeometry, busMaterial);
    bus.position.set(0, -0.5, 0);
    bus.castShadow = true;
    group.add(bus);
    
    parent.add(group);
    components.powerBus = group;
}

/**
 * Create antenna dish
 */
function createAntenna(parent) {
    const group = new THREE.Group();
    group.name = 'Antenna';
    
    // Antenna dish
    const dishGeometry = new THREE.SphereGeometry(1, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const antennaM = new THREE.MeshStandardMaterial({
        color: 0xffa500,
        metalness: 0.8,
        roughness: 0.3,
    });
    
    const dish = new THREE.Mesh(dishGeometry, antennaM);
    dish.position.set(0, 2, 3.5);
    dish.scale.set(1.2, 0.6, 1.2);
    dish.castShadow = true;
    dish.receiveShadow = true;
    group.add(dish);
    
    // Antenna arm
    const armGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 8);
    const armMaterial = new THREE.MeshStandardMaterial({
        color: 0x666666,
        metalness: 0.6,
        roughness: 0.4,
    });
    
    const arm = new THREE.Mesh(armGeometry, armMaterial);
    arm.position.set(0, 1, 3.5);
    arm.castShadow = true;
    group.add(arm);
    
    parent.add(group);
    components.antenna = group;
}

/**
 * Create payload and communication load blocks
 */
function createPayloadBlocks(parent) {
    const group = new THREE.Group();
    group.name = 'Payload Modules';
    
    const blockMaterial = new THREE.MeshStandardMaterial({
        color: 0x667eea,
        metalness: 0.4,
        roughness: 0.6,
    });
    
    // NIRCam module
    const nircamGeometry = new THREE.BoxGeometry(1.2, 1.2, 0.8);
    const nircam = new THREE.Mesh(nircamGeometry, blockMaterial);
    nircam.position.set(-1, 1.5, -0.5);
    nircam.castShadow = true;
    nircam.name = 'NIRCam';
    group.add(nircam);
    
    // FQM module
    const fqmGeometry = new THREE.BoxGeometry(1, 1, 1);
    const fqm = new THREE.Mesh(fqmGeometry, blockMaterial);
    fqm.position.set(1, 1.5, -0.5);
    fqm.castShadow = true;
    fqm.name = 'FQM';
    group.add(fqm);
    
    parent.add(group);
}

/**
 * Get the JWST group mesh
 */
export function getJWSTMesh() {
    if (jwstGroup) {
        console.log('✅ JWST Mesh retrieved:', {
            name: jwstGroup.name,
            position: jwstGroup.position,
            scale: jwstGroup.scale,
            children: jwstGroup.children.length,
            visible: jwstGroup.visible,
            parent: jwstGroup.parent ? jwstGroup.parent.name : 'null',
            worldPosition: new THREE.Vector3().setFromMatrixPosition(jwstGroup.matrixWorld)
        });
    } else {
        console.error('❌ JWST Mesh not found - jwstGroup is null');
    }
    return jwstGroup;
}

/**
 * Get specific component
 */
export function getComponent(name) {
    return components[name];
}

/**
 * Update JWST animations (e.g., subtle rotations)
 */
export function updateJWST(deltaTime) {
    if (jwstGroup) {
        // Subtle auto-rotation for visual interest
        // jwstGroup.rotation.y += deltaTime * 0.05;
    }
}
