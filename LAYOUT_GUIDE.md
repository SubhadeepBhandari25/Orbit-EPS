# ORBIT-EPS Visual Layout Guide

## Screen Layout Overview

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                               ┃
┃  ┌─HUD Panel──────┐          ┌─Biodata Panel───────┐         ┃
┃  │ ORBIT-EPS      │          │ JWST INFO           │         ┃
┃  │ James Webb...  │          │ (Hidden by default) │         ┃
┃  │                │          │                     │         ┃
┃  │ ☀️ SOLAR       │          │ Click JWST model    │         ┃
┃  │ 🔌 DIST.      │          │ to see details      │         ┃
┃  │ 🔋 BATTERY     │          │                     │         ┃
┃  │                │          └─────────────────────┘         ┃
┃  └────────────────┘                                           ┃
┃                                                               ┃
┃       ╔══════════════════════════════════════════════╗        ┃
┃       ║     3D CANVAS - JAMES WEBB TELESCOPE         ║        ┃
┃       ║                                              ║        ┃
┃       ║      [Gold Mirror Segments - 19 total]      ║        ┃
┃       ║           [Primary Mirror]                  ║        ┃
┃       ║    [Secondary Mirror & Supports]            ║        ║
┃       ║      [Sunshield - 5 layers]                 ║        ║
┃       ║      [Spacecraft Bus]                       ║        ║
┃       ║      [Solar Array]                          ║        ║
┃       ║      [Antenna]                              ║        ║
┃       ║                                              ║        ║
┃       ║  Mouse Controls:                             ║        ║
┃       ║  • Drag: Rotate | Scroll: Zoom             ║        ║
┃       ║  • Click JWST: View details                 ║        ║
┃       ╚══════════════════════════════════════════════╝        ┃
┃                                                               ┃
┃  ┌─Control Panel──┐          ┌─Chatbot Panel────┐            ┃
┃  │ ⚙️ CONTROLS   │          │ 🤖 Assistant     │            ┃
┃  │               │          │                  │            ┃
┃  │ 🌑 ECLIPSE  ☀️ DEPLOY  │ [Message Area]   │            ┃
┃  │ 🔄 RESET   🤖 ASSIST   │                  │            ┃
┃  │               │          │ [Input: Ask...] │            ┃
┃  │ ⚡ Load Power │          │ [Send Button →] │            ┃
┃  │ ━━━━━━━━━━━━ │          │                  │            ┃
┃  │ 300 W        │          └──────────────────┘            ┃
┃  │               │                                           ┃
┃  │ 💡 Click JWST │                                           ┃
┃  │    Drag:Rotate│                                           ┃
┃  └───────────────┘                                           ┃
┃                                                               ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## Panel Specifications

### 📊 HUD Panel (Top-Left)
- **Dimensions**: 320×auto (max 85vh)
- **Position**: top: 15px, left: 15px
- **Color Scheme**: Cyan border (#00d9ff), dark background
- **Content**:
  - Status indicator (green/yellow/red)
  - Solar Generation (V, I, P)
  - Power Distribution (Bus V, Load)
  - Battery Status (SOC%, Current)
  - Warnings display

### 📖 Biodata Panel (Top-Right)
- **Dimensions**: 380×auto (max 85vh)
- **Position**: top: 15px, right: 15px
- **Color Scheme**: Orange border (#ffa500)
- **Status**: Hidden by default
- **Trigger**: Click JWST model or click JWST in details
- **Content**:
  - JWST specifications
  - EPS technical details
  - Mission information
  - Educational notes

### 🎮 Control Panel (Bottom-Left)
- **Dimensions**: 300×auto
- **Position**: bottom: 15px, left: 15px
- **Color Scheme**: Green border (#00ff88)
- **Layout**: 
  - Header with icon
  - 2×2 Button Grid
  - Load power slider
  - Info text
- **Buttons**:
  1. 🌑 ECLIPSE (toggle eclipse mode)
  2. ☀️ DEPLOY (deploy solar panel)
  3. 🔄 RESET (reset simulation)
  4. 🤖 ASSIST (show chatbot)

### 💬 Chatbot Panel (Bottom-Right)
- **Dimensions**: 280×320px (compact)
- **Position**: bottom: 15px, right: 15px
- **Color Scheme**: Purple border (#667eea)
- **Layout**:
  - Compact header (12px padding)
  - Message display area (flex)
  - Input area (2-part)
- **Input**:
  - Text field: placeholder "Ask..."
  - Send button: "→" symbol

---

## 3D Model Components (From Back to Front)

```
Looking at JWST from front (camera at 0, 50, 120):

1. SUNSHIELD (Back - Thermal protection)
   ├─ Layer 1 (rear)
   ├─ Layer 2
   ├─ Layer 3
   ├─ Layer 4
   └─ Layer 5 (front)

2. SPACECRAFT BUS (Main body)
   ├─ 3×4×5m box
   └─ Color: Dark gray (0x1a1a2e)

3. PRIMARY MIRROR (Telescope optics)
   ├─ Outer Ring: 6 segments @ radius 8
   ├─ Middle Ring: 6 segments @ radius 5
   ├─ Inner Ring: 6 segments @ radius 2.5
   ├─ Center: 1 segment
   └─ Color: Gold (0xffd700)

4. SECONDARY MIRROR (Above primary)
   ├─ Sphere geometry (diameter ~2.4m)
   └─ Color: Reflective silver (0xcccccc)

5. SECONDARY SUPPORT (3 struts)
   ├─ Cylinder 1 (120° angle)
   ├─ Cylinder 2 (240° angle)
   └─ Cylinder 3 (360° angle)

6. SOLAR ARRAY (Right side extension)
   ├─ Large panel 8×5m
   ├─ Support arm
   └─ Color: Blue (0x4488ff)

7. ANTENNA (Bottom rear)
   ├─ Dish (semi-sphere)
   └─ Support arm

8. INSTRUMENTS (Inside bus)
   ├─ NIRCam module
   ├─ FQM module
   ├─ Battery module
   └─ Power distribution bus
```

---

## Color Palette

| Element | Color Code | RGB | Use |
|---------|-----------|-----|-----|
| Primary Mirror (Gold) | #ffd700 | (255, 215, 0) | Main telescope |
| Secondary Mirror (Silver) | #cccccc | (204, 204, 204) | Secondary optics |
| Sunshield (White) | #ffffff | (255, 255, 255) | Thermal protection |
| Bus (Dark) | #1a1a2e | (26, 26, 46) | Main body |
| Solar Panel (Blue) | #4488ff | (68, 136, 255) | Power generation |
| Battery (Glowing) | #00ff88 | (0, 255, 136) | Power storage |
| Antenna (Orange) | #ffa500 | (255, 165, 0) | Communication |
| Accent (Cyan) | #00d9ff | (0, 217, 255) | HUD highlights |

---

## Responsive Behavior

### Standard Desktop (1920×1080)
- All panels visible at full size
- Comfortable viewing of 3D model
- Clear separation of UI elements

### Medium Screen (1200×800)
- HUD: 320px → stays same
- Biodata: 380px → stays same
- Chatbot: 280px → stays same
- Control: 300px → stays same
- All panels still accessible

### Large Screen (2560×1440)
- Extra space for comfortable layout
- No changes needed
- All elements properly spaced

---

## Interaction Flow

```
User Actions:

1. Load Page
   └─> ORBIT-EPS initializes
       ├─> Three.js renderer starts
       ├─> JWST model loads
       ├─> Starfield renders
       ├─> HUD updates begin (60 FPS)
       └─> Ready for interaction

2. Click JWST Model
   └─> Biodata panel appears (top-right)
       └─> Shows mission specs & details

3. Adjust Load Power Slider
   └─> Chatbot receives real-time updates
       ├─> Battery discharge rate changes
       ├─> HUD values update
       └─> Visual feedback in all panels

4. Toggle Eclipse Mode
   └─> Solar generation stops
       ├─> Battery starts discharging
       ├─> Status light changes to yellow
       └─> Warnings appear in HUD

5. Click 🌑 ECLIPSE Button
   └─> Eclipse mode toggles
       ├─> Sunlight resumes
       ├─> Solar generation resumes
       ├─> Battery begins charging
       └─> Status light returns to green

6. Click 🤖 ASSIST Button
   └─> Chatbot panel appears/hides (bottom-right)
       └─> Type question to ask educational assistant

7. Interact with 3D Model
   └─> Drag mouse: Rotate view
       └─> Scroll wheel: Zoom in/out
           └─> Allows inspection of all components
```

---

## CSS Grid Distribution

### Control Panel Grid
```
Layout: 2 columns × 2 rows
Width distribution: 1fr 1fr (equal width)

┌──────────────┬──────────────┐
│ 🌑 ECLIPSE   │ ☀️ DEPLOY    │ (Gap: 8px)
├──────────────┼──────────────┤
│ 🔄 RESET     │ 🤖 ASSIST    │ (Gap: 8px)
└──────────────┴──────────────┘

Each button:
- Padding: 10px
- Font: 11px bold monospace
- Background: Gradient (green→cyan) or purple
- Border-radius: 4px
- Transition: smooth hover effect
```

---

## Performance Optimization

### Rendering
- Single canvas: Full screen
- Optimized geometry: ~100K triangles
- Efficient materials: PBR (Physically Based Rendering)
- Shadow mapping: 2048×2048

### UI
- CSS Grid for layouts (GPU accelerated)
- Flexbox for responsive design
- Minimal DOM elements
- Hardware-accelerated animations

### JavaScript
- 60 FPS target maintained
- Delta-time independent physics
- Efficient state management
- No memory leaks

---

## Accessibility Features

- Clear text contrast (cyan on dark)
- Large touch targets (buttons 10px+ padding)
- Keyboard support for controls
- Descriptive button labels with emojis
- Color-coded status indicators
- Readable font sizes (11-13px minimum)

---

**ORBIT-EPS: Complete Visual & Layout Documentation** ✨
