/**
 * ORBIT-EPS: Biodata Panel
 * 
 * Detailed information about JWST and the power system
 * Displayed when user clicks on the JWST model
 */

import { getPowerSystemExplanation } from './powerSystem.js';

/**
 * Initialize biodata system
 */
export function initBiodata() {
    // Biodata is shown via showBiodata() in main.js
}

/**
 * Get detailed JWST specifications
 */
export function getJWSTSpecifications() {
    return {
        general: {
            name: "James Webb Space Telescope",
            launchDate: "December 25, 2021",
            operator: "NASA/ESA/CSA",
            purpose: "Infrared astronomy and scientific observation",
            location: "Sun-Earth L2 (1.5 million km from Earth)",
        },
        optics: {
            primaryMirror: "6.6 m (segmented, 18 beryllium hexagons with gold coating)",
            secondaryMirror: "0.74 m (beryllium)",
            focalLength: "131.4 m (effective)",
            wavelengthRange: "0.6 - 28.3 micrometers (infrared)",
        },
        structure: {
            sunshield: "Five-layer shields (size of tennis court)",
            spacecraftBus: "3m × 4m × 5m aluminum/composite",
            totalMass: "~6,200 kg",
            deployable: "Yes - unfolds in space",
        },
        power: {
            solarPanels: "1 deployable array (~32 m²)",
            nominalPower: "2,000 W average (4,000 W peak)",
            busVoltage: "28 V DC",
            batteryCapacity: "14 kWh (Ni-H₂ cells)",
            eclipse: "~35 minutes every ~48 hours at L2",
        },
    };
}

/**
 * Get EPS explanation sections
 */
export function getEPSExplanations() {
    return getPowerSystemExplanation();
}
