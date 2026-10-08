/**
 * ORBIT-EPS: Power System Logic
 * 
 * Simulates electrical power generation, storage, and distribution
 * Based on first-year EECT theory: P = V × I, Battery charging/discharging
 */

/**
 * Power system state
 */
let powerSystemState = {
    // Solar array parameters
    solarVoltage: 100,      // Volts (DC source)
    solarCurrent: 0,        // Amperes
    generatedPower: 0,      // Watts (P = V × I)
    
    // Bus parameters
    busVoltage: 28.0,       // Standard spacecraft bus voltage (Volts)
    busRegulated: true,     // Voltage regulation active
    
    // Load parameters
    loadPower: 300,         // Watts
    totalLoadPower: 0,      // Watts
    
    // Battery parameters
    batteryCapacity: 100,   // Percentage (0-100%)
    batteryVoltage: 28.0,   // Volts
    batteryCurrent: 0,      // Amperes
    batterySOC: 100,        // State of Charge (%)
    maxChargingRate: 150,   // W
    maxDischargingRate: 300, // W
    
    // System state
    isEclipse: false,
    isCharging: false,
    isDischarging: false,
    
    // Energy tracking
    totalEnergyGenerated: 0, // Joules
    totalEnergyConsumed: 0,  // Joules
};

/**
 * Initialize power system
 */
export function initPowerSystem() {
    console.log('⚡ Power system initialized');
    return powerSystemState;
}

/**
 * Update power system based on simulation time and conditions
 * 
 * Core EECT equations:
 * - Power Generation: P_solar = V_solar × I_solar
 * - Power Balance: P_available = P_generated + (P_battery if discharging)
 * - Battery Charging: dSOC/dt = (P_generated - P_load) / Battery_Capacity
 */
export function updatePowerSystem(deltaTime, loadPower, isEclipse) {
    // Update eclipse state
    powerSystemState.isEclipse = isEclipse;
    powerSystemState.loadPower = loadPower;
    
    // ============ SOLAR POWER GENERATION ============
    if (!isEclipse) {
        // Solar panel generates power proportional to sun exposure
        // Simplified model: Maximum power output is 4000W at full sun
        // Using realistic solar panel output curve
        
        const maxSolarPower = 4000; // Watts at full sun
        const solarPanel = {
            area: 32, // square meters
            efficiency: 0.30, // 30% efficiency
            sunIntensity: 1360, // W/m² (solar constant)
        };
        
        // Calculate current from available solar power
        const availableSolarPower = solarPanel.area * solarPanel.efficiency * solarPanel.sunIntensity;
        const limitedSolarPower = Math.min(availableSolarPower, maxSolarPower);
        
        // DC generation: P = V × I, so I = P / V
        powerSystemState.solarVoltage = 100; // Fixed DC voltage from panel
        powerSystemState.solarCurrent = limitedSolarPower / powerSystemState.solarVoltage;
        powerSystemState.generatedPower = limitedSolarPower;
    } else {
        // Eclipse: No sunlight
        powerSystemState.solarVoltage = 0;
        powerSystemState.solarCurrent = 0;
        powerSystemState.generatedPower = 0;
    }
    
    // ============ POWER DISTRIBUTION & REGULATION ============
    // Voltage regulator converts solar DC (100V) to bus voltage (28V)
    // Efficiency: ~95%
    const regulatorEfficiency = 0.95;
    const availableBusPower = powerSystemState.generatedPower * regulatorEfficiency;
    
    // Determine total load
    const totalSystemLoad = loadPower; // User-controlled + base spacecraft loads
    powerSystemState.totalLoadPower = totalSystemLoad;
    
    // ============ BATTERY CHARGING/DISCHARGING ============
    const powerBalance = availableBusPower - totalSystemLoad;
    
    if (powerBalance > 0 && powerSystemState.batterySOC < 100) {
        // Charging mode
        const chargingPower = Math.min(powerBalance, powerSystemState.maxChargingRate);
        const batteryChargingCurrent = chargingPower / powerSystemState.batteryVoltage;
        
        powerSystemState.isCharging = true;
        powerSystemState.isDischarging = false;
        powerSystemState.batteryCurrent = batteryChargingCurrent;
        
        // Update battery SOC
        // Battery capacity in Watt-hours (28V × 500Ah = 14000 Wh)
        const batteryCapacityWh = 14000;
        const chargeIncrement = (chargingPower * deltaTime) / batteryCapacityWh * 100;
        powerSystemState.batterySOC = Math.min(100, powerSystemState.batterySOC + chargeIncrement);
        
    } else if (powerBalance < 0 || (isEclipse && powerSystemState.batterySOC > 0)) {
        // Discharging mode (battery supplies power during eclipse or power deficit)
        const dischargePower = Math.min(
            Math.abs(powerBalance),
            powerSystemState.maxDischargingRate,
            powerSystemState.batterySOC > 5 ? Infinity : 0 // Prevent deep discharge
        );
        
        const batteryDischargingCurrent = dischargePower / powerSystemState.batteryVoltage;
        
        powerSystemState.isCharging = false;
        powerSystemState.isDischarging = true;
        powerSystemState.batteryCurrent = -batteryDischargingCurrent; // Negative for discharge
        
        // Update battery SOC
        const batteryCapacityWh = 14000;
        const dischargeDecrement = (dischargePower * deltaTime) / batteryCapacityWh * 100;
        powerSystemState.batterySOC = Math.max(0, powerSystemState.batterySOC - dischargeDecrement);
        
    } else {
        // Battery idle (neither charging nor discharging significantly)
        powerSystemState.isCharging = false;
        powerSystemState.isDischarging = false;
        powerSystemState.batteryCurrent = 0;
    }
    
    // ============ ENERGY TRACKING ============
    powerSystemState.totalEnergyGenerated += powerSystemState.generatedPower * deltaTime;
    powerSystemState.totalEnergyConsumed += totalSystemLoad * deltaTime;
    
    // Clamp battery SOC
    powerSystemState.batterySOC = Math.max(0, Math.min(100, powerSystemState.batterySOC));
    
    return powerSystemState;
}

/**
 * Get current power system state
 */
export function getPowerSystemState() {
    return powerSystemState;
}

/**
 * Reset power system to initial state
 */
export function resetPowerSystem() {
    powerSystemState.batterySOC = 100;
    powerSystemState.totalEnergyGenerated = 0;
    powerSystemState.totalEnergyConsumed = 0;
    powerSystemState.isCharging = false;
    powerSystemState.isDischarging = false;
}

/**
 * Get power system explanation (for chatbot and biodata)
 */
export function getPowerSystemExplanation() {
    return {
        generation: {
            title: "How Solar Energy Becomes Electrical Energy",
            explanation: "The solar panel converts sunlight into DC electrical power using the photovoltaic effect. The generated power is P = V × I, where V is the solar voltage (~100V) and I is the current produced.",
        },
        regulation: {
            title: "Power Regulation",
            explanation: "A voltage regulator converts the high solar voltage (100V) to a safe spacecraft bus voltage (28V) with ~95% efficiency. This is essential for powering sensitive spacecraft systems.",
        },
        battery: {
            title: "Battery Backup",
            explanation: "During eclipse (no sunlight), the battery supplies power to critical systems. Charging equation: dSOC/dt ∝ (P_generated - P_load). Battery capacity: 14,000 Wh.",
        },
        eclipse: {
            title: "Eclipse Operation",
            explanation: "When JWST passes behind Earth's shadow (eclipse), there's no sunlight. The battery must power all systems. Duration ~35 minutes for JWST's L2 orbit.",
        },
        limitations: {
            title: "Model Simplifications",
            explanation: [
                "- Real JWST has multiple independent solar arrays",
                "- We show single panel for clarity",
                "- Temperature effects on panel efficiency ignored",
                "- Simplified voltage regulation model",
                "- Battery chemistry simplified (no internal resistance)",
                "- No detailed load profile per subsystem",
            ],
        },
    };
}

/**
 * Utility: Format power values for UI
 */
export function formatPower(watts) {
    if (watts >= 1000) {
        return (watts / 1000).toFixed(2) + ' kW';
    }
    return watts.toFixed(1) + ' W';
}

export function formatEnergy(joules) {
    if (joules >= 3600000) {
        return (joules / 3600000).toFixed(2) + ' kWh';
    }
    return (joules / 1000).toFixed(2) + ' kJ';
}
