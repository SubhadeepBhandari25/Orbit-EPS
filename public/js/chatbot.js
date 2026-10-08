/**
 * ORBIT-EPS: Educational Chatbot
 * 
 * AI-powered educational assistant explaining EPS concepts
 * Uses simple first-year EECT terminology
 */

import { getPowerSystemState, getPowerSystemExplanation } from './powerSystem.js';
import { getJWSTSpecifications, getEPSExplanations } from './biodata.js';

// Knowledge base for chatbot responses
const knowledgeBase = {
    // Basic concepts
    power: {
        keywords: ['power', 'watt', 'energy', 'consumption', 'generation'],
        response: `⚡ Power is the rate of energy flow, measured in Watts (W).
        
Equation: P = V × I (Power = Voltage × Current)

In JWST:
- Solar panel generates power: P_solar = 100V × I (current varies with sunlight)
- Spacecraft consumes power through loads
- Battery stores energy: Energy (Wh) = Power (W) × Time (hours)`,
    },
    
    solar: {
        keywords: ['solar', 'sun', 'panel', 'light', 'generation', 'photovoltaic'],
        response: `☀️ Solar panels convert sunlight into electrical power using photons.

How it works:
1. Photons hit silicon cells
2. Electrons are knocked loose (photovoltaic effect)
3. Electrons flow as electric current
4. Current × Voltage = Power

JWST Solar Panel:
- Area: 32 m²
- Efficiency: 30% (converts 30% of sunlight to electricity)
- Max output: 4,000 W (at full sunlight)
- Generates DC power at ~100V`,
    },
    
    eclipse: {
        keywords: ['eclipse', 'dark', 'shadow', 'night', 'no sun'],
        response: `🌑 Eclipse occurs when JWST passes into Earth's shadow (~35 minutes).

During Eclipse:
- No sunlight reaches solar panel
- Solar power generation = 0
- Battery must supply ALL power
- Duration: ~35 minutes
- Happens every ~48 hours at L2 orbit

Why Important?
- Battery must survive multiple eclipse cycles
- Thermal management is critical
- Load must be managed during eclipse`,
    },
    
    battery: {
        keywords: ['battery', 'charging', 'discharge', 'soc', 'state of charge'],
        response: `🔋 The battery stores energy for use during eclipse.

How it works:
- CHARGING: When P_solar > P_load → battery fills up
- DISCHARGING: When P_solar < P_load → battery supplies power
- State of Charge (SOC): 0% (empty) to 100% (full)

JWST Battery:
- Type: Nickel-Hydrogen (Ni-H₂)
- Capacity: 14,000 Wh (14 kWh)
- Voltage: 28V DC
- Must survive 5-10 year mission

Charging Rate: dSOC/dt ∝ (P_generated - P_load)`,
    },
    
    voltage: {
        keywords: ['voltage', 'volt', 'v', 'regulation', 'bus', 'regulated'],
        response: `🔌 Voltage is the electrical potential difference, measured in Volts (V).

Voltage Levels:
- Solar panel: 100 V DC (high voltage for efficiency)
- Spacecraft bus: 28 V DC (standard, safe for systems)
- Converter efficiency: ~95%

Voltage Regulation:
- DC-DC converter steps down 100V to 28V
- Must be stable (spacecraft systems need consistent voltage)
- If voltage drops, current must increase to maintain power`,
    },
    
    current: {
        keywords: ['current', 'amp', 'ampere', 'a', 'i'],
        response: `⚡ Electric current is the flow of electrons, measured in Amperes (A).

Relationship to Power:
P = V × I
I = P / V

In JWST:
- High voltage (100V) → lower current in wires → thinner wires
- Low voltage (28V) → higher current in bus → thicker wires
- Lower current = less power loss in solar panel area`,
    },
    
    load: {
        keywords: ['load', 'consumption', 'subsystem', 'power draw', 'demand'],
        response: `📊 Load is the power consumed by spacecraft systems.

JWST Loads:
- NIRCam (infrared camera): ~600 W
- Science instruments: ~400 W
- Computers & processors: ~300 W
- Heaters (thermal control): ~400 W
- Communications: ~200 W
- Total varies with mission phase

Load Management:
- During high-load periods, battery helps
- During eclipse, load must be < battery discharge rate
- User can adjust load slider in this simulator`,
    },
    
    regulation: {
        keywords: ['regulation', 'regulate', 'converter', 'ppt', 'mppt'],
        response: `⚙️ Voltage regulation ensures stable power delivery.

JWST Uses:
- Peak Power Tracking (PPT) converter
- Maximizes solar panel output
- Steps down 100V to 28V bus
- Efficiency: ~95%

Why Necessary?
- Solar panel voltage varies with sunlight intensity
- Spacecraft systems need stable 28V
- Prevents damage from voltage spikes
- Ensures efficient power transfer`,
    },
    
    energy: {
        keywords: ['energy', 'joule', 'kilowatt', 'wh', 'kwh'],
        response: `💡 Energy is the total work done over time, measured in Joules or Watt-hours.

Relationship:
Energy (Wh) = Power (W) × Time (hours)
Energy (J) = Power (W) × Time (seconds)

Examples:
- 1000 W for 1 hour = 1 kWh = 3,600,000 J
- 4000 W × 10 hours (night side) = 40 kWh

JWST Battery:
- Capacity: 14 kWh
- Must last entire mission
- Multiple charge/discharge cycles`,
    },
    
    physics: {
        keywords: ['physics', 'equation', 'law', 'ohm', 'joule'],
        response: `🧪 JWST EPS uses fundamental laws of electromagnetism.

Key Equations:
1. P = V × I (Power law)
2. V = I × R (Ohm's law)
3. Energy = P × t (Energy)
4. SOC = ∫(P/Capacity) dt (Battery integration)

Conservation Laws:
- Energy is conserved (generated = consumed + stored)
- Current flows in complete circuits
- Voltage drops across loads`,
    },
    
    mission: {
        keywords: ['mission', 'jwst', 'james webb', 'telescope', 'astronomy'],
        response: `🌌 JWST is humanity's most powerful space telescope.

Mission Details:
- Launch: December 25, 2021
- Orbit: Sun-Earth L2 (1.5M km from Earth)
- Wavelength: Infrared (0.6-28 micrometers)
- Purpose: Study early universe, galaxies, stars

Key Features:
- 6.6m segmented primary mirror (gold-coated beryllium)
- 5-layer sunshield (size of tennis court)
- Autonomous deployment in space
- Unfolded to 70m × 14m after launch

EPS Critical for:
- Science operations require stable power
- Eclipse survival essential for continuous operation
- Thermal control via power management`,
    },
    
    limitations: {
        keywords: ['limit', 'simplif', 'assumption', 'real', 'actual'],
        response: `⚠️ This simulator is an EDUCATIONAL MODEL.

Simplifications Made:
1. Single solar panel (real JWST has optimized array)
2. Linear battery model (real: complex chemistry)
3. Constant panel efficiency (real: varies with T, angle)
4. No internal voltage drops (real: resistances exist)
5. Ideal converters (real: ~95% efficiency)
6. No thermal effects (real: critical for operation)
7. Simplified load profile (real: subsystem-specific)

Why Simplified?
- First-year engineering level
- Exam-friendly (easy to explain)
- Visual clarity for education
- Real JWST is vastly more complex

Real Complexity:
- Rad-hardened electronics
- Redundant systems
- Complex thermal management
- 10+ years of flight heritage`,
    },
};

/**
 * Initialize chatbot
 */
export function initChatbot() {
    const messagesDiv = document.getElementById('chatbot-messages');
    messagesDiv.innerHTML = '';
    
    // Welcome message
    addChatbotMessage(
        `🤖 Educational Assistant Ready

I can help explain:
- Power systems and equations
- Solar generation
- Eclipse operation
- Battery charging/discharging
- Voltage regulation
- JWST mission details

Ask me anything! (e.g., "How does solar power work?")`,
        'bot'
    );
}

/**
 * Process user message and generate response
 */
export function processChatbotMessage(userMessage) {
    // Add user message
    addChatbotMessage(userMessage, 'user');
    
    // Generate response
    const response = generateResponse(userMessage);
    
    // Add bot response with slight delay for natural feel
    setTimeout(() => {
        addChatbotMessage(response, 'bot');
    }, 300);
}

/**
 * Generate chatbot response based on user input
 */
function generateResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Check knowledge base
    for (const [topic, data] of Object.entries(knowledgeBase)) {
        for (const keyword of data.keywords) {
            if (message.includes(keyword)) {
                return data.response;
            }
        }
    }
    
    // Current system state questions
    if (message.includes('status') || message.includes('state') || message.includes('current')) {
        const state = getPowerSystemState();
        return `📊 Current System Status:

☀️ Solar: ${state.solarPower?.toFixed(0) || 0} W generated
🔋 Battery: ${state.batterySOC?.toFixed(1) || 0}% charged
🔌 Load: ${state.totalLoadPower?.toFixed(0) || 0} W
📈 Mode: ${state.isCharging ? 'CHARGING' : state.isDischarging ? 'DISCHARGING' : 'IDLE'}`;
    }
    
    // Help request
    if (message.includes('help') || message.includes('explain') || message.includes('how')) {
        return `📚 I can explain:
1. Power (P = V × I)
2. Solar energy conversion
3. Battery charging/discharging
4. Eclipse operation
5. Voltage regulation
6. Current and voltage basics
7. Energy storage
8. JWST mission overview

Try asking: "How does solar power work?" or "What is eclipse?"`;
    }
    
    // Default response
    return `I'm not sure about that topic. 

Try asking about:
- Power systems and equations
- Solar generation
- Eclipse mode
- Battery operation
- Voltage/current
- JWST specifications
- Model limitations
- Energy concepts

Or type "help" for suggestions.`;
}

/**
 * Add message to chatbot display
 */
function addChatbotMessage(text, sender) {
    const messagesDiv = document.getElementById('chatbot-messages');
    
    const messageEl = document.createElement('div');
    messageEl.className = `chatbot-message ${sender}`;
    messageEl.textContent = text;
    
    messagesDiv.appendChild(messageEl);
    
    // Auto-scroll to bottom
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

/**
 * Clear chat history
 */
export function clearChatHistory() {
    const messagesDiv = document.getElementById('chatbot-messages');
    messagesDiv.innerHTML = '';
    initChatbot();
}
