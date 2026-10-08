/**
 * ORBIT-EPS: UI and HUD Management
 * 
 * Manages all real-time HUD displays and user interface updates
 * Shows power system status, battery state, and system messages
 */

import { getPowerSystemState, formatPower, formatEnergy } from './powerSystem.js';

let currentPowerState = null;

/**
 * Update HUD with real-time power system values
 */
export function updateHUD(powerState, isEclipse) {
    currentPowerState = powerState;
    
    // ============ SOLAR GENERATION SECTION ============
    document.getElementById('solar-voltage').textContent = powerState.solarVoltage.toFixed(1);
    document.getElementById('solar-current').textContent = powerState.solarCurrent.toFixed(2);
    document.getElementById('generated-power').textContent = powerState.generatedPower.toFixed(0);
    
    // ============ POWER DISTRIBUTION SECTION ============
    document.getElementById('bus-voltage').textContent = powerState.busVoltage.toFixed(1);
    document.getElementById('load-power').textContent = powerState.totalLoadPower.toFixed(0);
    
    // ============ BATTERY STATUS SECTION ============
    document.getElementById('battery-soc').textContent = powerState.batterySOC.toFixed(1);
    document.getElementById('battery-current').textContent = powerState.batteryCurrent.toFixed(2);
    
    // Update battery fill bar
    const batteryFill = document.getElementById('battery-fill');
    batteryFill.style.width = powerState.batterySOC + '%';
    
    // Battery animation based on state
    if (powerState.isCharging) {
        batteryFill.className = 'battery-fill charging';
    } else if (powerState.isDischarging) {
        batteryFill.className = 'battery-fill discharging';
    } else {
        batteryFill.className = 'battery-fill';
    }
    
    // ============ STATUS AND WARNINGS ============
    updateStatusIndicator(powerState, isEclipse);
    updateWarnings(powerState, isEclipse);
}

/**
 * Update status light and message
 */
function updateStatusIndicator(powerState, isEclipse) {
    const statusLight = document.getElementById('status-light');
    const statusMessage = document.getElementById('status-message');
    
    statusLight.className = 'status-indicator';
    
    if (isEclipse) {
        statusMessage.textContent = 'ECLIPSE MODE ACTIVE';
        statusLight.classList.add('warning');
    } else if (powerState.batterySOC < 15) {
        statusMessage.textContent = 'LOW BATTERY WARNING';
        statusLight.classList.add('critical');
    } else if (powerState.batterySOC < 30) {
        statusMessage.textContent = 'BATTERY LOW';
        statusLight.classList.add('warning');
    } else {
        statusMessage.textContent = 'NORMAL OPERATION';
        statusLight.className = 'status-indicator';
    }
}

/**
 * Update warning messages
 */
function updateWarnings(powerState, isEclipse) {
    const warningsDiv = document.getElementById('hud-warnings');
    warningsDiv.innerHTML = '';
    
    const warnings = [];
    
    if (isEclipse) {
        warnings.push({
            text: '⚠️ ECLIPSE MODE: Solar generation OFF',
            level: 'warning',
        });
    }
    
    if (powerState.batterySOC < 15) {
        warnings.push({
            text: '🔴 CRITICAL: Battery below 15%',
            level: 'critical',
        });
    } else if (powerState.batterySOC < 30) {
        warnings.push({
            text: '⚠️ WARNING: Battery below 30%',
            level: 'warning',
        });
    }
    
    if (powerState.totalLoadPower > powerState.generatedPower) {
        warnings.push({
            text: '⚡ Load exceeds generation - using battery',
            level: 'warning',
        });
    }
    
    if (powerState.batterySOC > 95) {
        warnings.push({
            text: '✓ Battery fully charged',
            level: 'info',
        });
    }
    
    // Render warnings
    if (warnings.length === 0) {
        warningsDiv.innerHTML = '<div class="warning-item">✓ All systems nominal</div>';
    } else {
        warnings.forEach(warning => {
            const warningEl = document.createElement('div');
            warningEl.className = `warning-item ${warning.level}`;
            warningEl.textContent = warning.text;
            warningsDiv.appendChild(warningEl);
        });
    }
}

/**
 * Show JWST biodata panel
 */
export function showBiodata() {
    const panel = document.getElementById('biodata-panel');
    panel.classList.add('active');
    
    // Populate biodata content
    const content = document.getElementById('biodata-content');
    content.innerHTML = generateBiodataHTML();
}

/**
 * Close biodata panel
 */
export function closeBiodata() {
    const panel = document.getElementById('biodata-panel');
    panel.classList.remove('active');
}

/**
 * Generate biodata HTML content
 */
function generateBiodataHTML() {
    return `
        <div class="biodata-section">
            <h3>Mission Overview</h3>
            <p>The James Webb Space Telescope (JWST) is a space-based infrared observatory launched on December 25, 2021, by NASA in collaboration with ESA and CSA.</p>
            <p><strong>Launch Date:</strong> December 25, 2021</p>
            <p><strong>Orbit:</strong> Sun-Earth L2 (Lagrange Point 2, ~1.5 million km from Earth)</p>
            <p><strong>Primary Mission:</strong> Infrared astronomical observation</p>
        </div>
        
        <div class="biodata-section">
            <h3>Primary Mirror</h3>
            <p><strong>Type:</strong> Segmented beryllium with gold coating</p>
            <p><strong>Segments:</strong> 18 hexagonal segments</p>
            <p><strong>Diameter:</strong> 6.6 meters (effective collecting area)</p>
            <p><strong>Material:</strong> Beryllium (lightweight) with gold (IR reflective)</p>
        </div>
        
        <div class="biodata-section">
            <h3>Electrical Power System (EPS)</h3>
            <p><strong>Primary Power Source:</strong> One deployable solar array</p>
            <p><strong>Solar Panel Area:</strong> ~32 m²</p>
            <p><strong>Panel Efficiency:</strong> ~30% (multi-junction solar cells)</p>
            <p><strong>Maximum Generation:</strong> ~4,000 W (at full sunlight)</p>
            <p><strong>Bus Voltage:</strong> 28 V DC (standard spacecraft voltage)</p>
            <p><strong>Regulation Method:</strong> Peak Power Tracking (PPT) converter</p>
        </div>
        
        <div class="biodata-section">
            <h3>Battery System</h3>
            <p><strong>Type:</strong> Nickel-Hydrogen (Ni-H₂) rechargeable batteries</p>
            <p><strong>Total Capacity:</strong> 14 kWh</p>
            <p><strong>Voltage:</strong> 28 V nominal</p>
            <p><strong>Purpose:</strong> Backup power during eclipse periods and peak loads</p>
            <p><strong>Cycle Life:</strong> Designed for 5-10 year mission with cycling</p>
        </div>
        
        <div class="biodata-section">
            <h3>How Eclipse Works</h3>
            <p>JWST orbits at the Sun-Earth L2 point. Approximately every half-orbit (~35 minutes), JWST passes into Earth's shadow:</p>
            <ul class="biodata-list">
                <li><strong>Sunlight Mode:</strong> Solar panel generates power directly</li>
                <li><strong>Eclipse Mode:</strong> No sunlight → battery supplies all power</li>
                <li><strong>Transition:</strong> Takes ~10 minutes (thermal management critical)</li>
            </ul>
        </div>
        
        <div class="biodata-section">
            <h3>Power Distribution</h3>
            <p><strong>Main Loads:</strong></p>
            <ul class="biodata-list">
                <li>Infrared detectors and science instruments</li>
                <li>Onboard computers and processors</li>
                <li>Communication systems (transmitters/receivers)</li>
                <li>Thermal control heaters</li>
                <li>Motor control units (mirror adjustment, sunshield)</li>
            </ul>
        </div>
        
        <div class="biodata-section">
            <h3>Educational Simplifications</h3>
            <p>This simulation uses first-year EECT concepts for clarity:</p>
            <ul class="biodata-list">
                <li>Simplified solar panel model (ignores temperature, angle)</li>
                <li>Single panel shown (real JWST has optimized panels)</li>
                <li>Linear battery model (real batteries have complex characteristics)</li>
                <li>Ideal voltage regulation (real systems have losses)</li>
                <li>No thermal transients during eclipse</li>
                <li>Load is adjustable (simplified from actual subsystems)</li>
            </ul>
        </div>
        
        <div class="biodata-section">
            <h3>Real-World Complexity (Not Included)</h3>
            <ul class="biodata-list">
                <li>Temperature effects on panel efficiency</li>
                <li>Micrometeorite shielding effects</li>
                <li>Dynamic spacecraft attitude control</li>
                <li>Radiation and SEE (Single Event Effects)</li>
                <li>Aging and degradation over time</li>
                <li>Power management unit (PMU) faults</li>
                <li>Detailed load profile per subsystem</li>
            </ul>
        </div>
        
        <div class="biodata-section" style="background: rgba(255, 165, 0, 0.1); padding: 10px; border-radius: 4px;">
            <h3 style="color: #ffcc00;">For Viva/Exam Discussion</h3>
            <p><strong>Key Points to Explain:</strong></p>
            <ul class="biodata-list">
                <li>Why batteries are essential (eclipse backup)</li>
                <li>Power equation: P = V × I (fundamental to EPS)</li>
                <li>Eclipse = 0 solar power → battery handles load</li>
                <li>Voltage regulation importance (28V standard)</li>
                <li>Trade-off: Battery weight vs. eclipse duration</li>
            </ul>
        </div>
    `;
}

/**
 * Utility: Show temporary notification
 */
export function showNotification(message, duration = 3000) {
    const div = document.createElement('div');
    div.style.cssText = `
        position: fixed;
        bottom: 440px;
        left: 20px;
        background: rgba(0, 255, 136, 0.9);
        color: #000;
        padding: 12px 20px;
        border-radius: 4px;
        font-weight: bold;
        z-index: 200;
        animation: slideIn 0.3s ease;
    `;
    div.textContent = message;
    document.body.appendChild(div);
    
    setTimeout(() => {
        div.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => div.remove(), 300);
    }, duration);
}

/**
 * Toggle debug mode
 */
export function toggleDebugMode() {
    const monitor = document.getElementById('performance-monitor');
    monitor.classList.toggle('debug');
}
