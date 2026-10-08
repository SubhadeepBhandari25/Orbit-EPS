# ORBIT-EPS Installation & Quick Start Guide

## ⚡ Super Quick Start (3 Steps)

### Step 1: Open Terminal
```
Press: Windows Key + R
Type: cmd
Press: Enter
```

### Step 2: Navigate to Project
```cmd
cd "c:\Users\subha\Desktop\COLLEGE STUDY\ORBIT-EPS"
```

### Step 3: Install and Run
```cmd
npm install
npm start
```

### Step 4: Open Browser
- Go to: **http://localhost:3000**
- Wait 5-10 seconds for loading
- See JWST in deep space!

---

## 🎮 First Time Using?

### What You'll See
1. **3D JWST Model** - Centered with starfield background
2. **HUD Panel** (top-left) - Shows real-time power values
3. **Control Panel** (bottom-left) - Buttons and sliders
4. **Chatbot** (bottom-right) - Educational assistant
5. **Performance Monitor** (top-right) - FPS counter (debug)

### Try These First
1. **Rotate:** Click and drag on JWST to rotate
2. **Zoom:** Scroll wheel to zoom in/out
3. **Toggle Eclipse:** Check the "Eclipse Mode" box
4. **Watch Battery:** See battery discharge during eclipse
5. **Click JWST:** Opens information panel
6. **Ask Chatbot:** Type "How does solar power work?"

### What's Happening?
- **Green numbers** = Solar generation (normal)
- **Red bar** = Battery discharging (eclipse)
- **Green bar** = Battery charging (sunlight)
- **Yellow warning** = Battery low

---

## ✅ System Requirements

| Component | Requirement |
|-----------|-------------|
| **OS** | Windows 10/11 |
| **Node.js** | v14 or higher |
| **RAM** | 1 GB free |
| **GPU** | Any (integrated OK) |
| **Browser** | Chrome, Firefox, Edge |
| **Internet** | For CDN libraries (Three.js) |

---

## 🔧 Detailed Installation

### 1. Install Node.js
- Download: https://nodejs.org/
- Choose **LTS version** (recommended)
- Run installer, click "Next" for all defaults
- Restart computer
- Verify installation:
  ```cmd
  node --version
  npm --version
  ```

### 2. Get to Project Folder
```cmd
cd "c:\Users\subha\Desktop\COLLEGE STUDY\ORBIT-EPS"
```

You should see:
```
 Volume in drive C is ...
 
Directory of c:\Users\...\ORBIT-EPS

12/16/2025  08:00 AM    <DIR>  public
12/16/2025  08:00 AM    <DIR>  src
12/16/2025  08:00 AM  1.2 KB  package.json
12/16/2025  08:00 AM  2.1 KB  server.js
12/16/2025  08:00 AM  15 KB   README.md
```

### 3. Install Dependencies
```cmd
npm install
```

**Expected output:**
```
added 50 packages in 5.23s
```

**If error:** "npm: command not found"
- Restart computer (Node.js installation)
- Try again

### 4. Start Server
```cmd
npm start
```

**Expected output:**
```
╔══════════════════════════════════════════════════════════╗
║   ORBIT-EPS: JWST 3D Electrical Power System Simulator   ║
║                                                          ║
║   Server running at: http://localhost:3000             ║
║                                                          ║
║   Press Ctrl+C to stop the server                       ║
╚══════════════════════════════════════════════════════════╝
```

**Don't close this terminal while running!**

### 5. Open in Browser
1. Open new web browser
2. Navigate to: **http://localhost:3000**
3. Wait 5-10 seconds for model to load
4. You should see JWST in space!

---

## 🎯 Demo Walkthrough (5 Minutes)

### Minute 1: Normal Operation
```
1. Look at HUD (top-left)
2. Solar Voltage: ~100V
3. Solar Current: ~40A
4. Generated Power: ~4000W
5. Battery SOC: ~100%
```
**Explain:** "Solar panel generates 4000W in full sunlight using P = V × I"

### Minute 2: Adjust Load
```
1. Find Load slider (bottom-left, says "Load Power")
2. Drag slider to 500W
3. Watch HUD update in real-time
4. Load Power: 500W
5. If Power > Load: Battery charges
```
**Explain:** "When solar generation exceeds load, battery charges"

### Minute 3: Activate Eclipse
```
1. Check "Eclipse Mode" checkbox
2. Watch Solar section of HUD
3. Solar Voltage: 0V (instant!)
4. Solar Current: 0A
5. Generated Power: 0W
6. Battery SOC: starts decreasing
```
**Explain:** "During eclipse, solar panel can't generate. Battery takes over."

### Minute 4: Low Battery
```
1. Keep eclipse on for ~2 minutes
2. Watch Battery SOC decrease
3. When SOC < 30%: Status light turns YELLOW
4. Message: "BATTERY LOW"
5. When SOC < 15%: Status light turns RED
```
**Explain:** "Battery discharge during eclipse is critical. If depleted, spacecraft loses power."

### Minute 5: Click & Explore
```
1. Turn off eclipse (uncheck box)
2. Click directly on the JWST model (3D area)
3. Info panel appears (top-right)
4. Scroll and read specifications
5. Discuss key points with examiner
```
**Explain:** "Solar panel: 32m², 30% efficiency, generates 4kW max"

---

## 🔌 Key Concepts for Exam

### Power Equation: P = V × I
- **P** = Power (Watts)
- **V** = Voltage (Volts)
- **I** = Current (Amperes)
- **Example:** 100V × 40A = 4000W

### Battery During Eclipse
```
Eclipse = Earth's shadow (~35 minutes)
No sunlight → No solar generation
Battery supplies ALL power
SOC decreases at rate: -300W / 14000Wh = -2.1%/hour
```

### Voltage Regulation
```
Solar panel: 100V DC (high, efficient)
Spacecraft bus: 28V DC (standard, safe)
Converter: 100V → 28V @ 95% efficiency
```

### Energy Conservation
```
Energy_generated = Energy_consumed + Energy_stored_in_battery
During eclipse: Battery supplies energy consumed by loads
```

---

## ⚠️ Common Issues & Fixes

### Issue: "npm: command not found"
**Cause:** Node.js not installed
**Fix:**
1. Download Node.js from https://nodejs.org/
2. Install it
3. Restart computer
4. Try `npm install` again

### Issue: Port 3000 already in use
**Cause:** Another app using port 3000
**Fix:**
```cmd
netstat -ano | findstr :3000
taskkill /PID [PID] /F
```
Or just use different port:
1. Open `server.js`
2. Change `const PORT = 3000;` to `const PORT = 3001;`
3. Run server again

### Issue: Blank black screen
**Cause:** Browser caching or slow load
**Fix:**
1. Wait 10 seconds
2. Press Ctrl+Shift+Del (clear cache)
3. Close browser tab
4. Open http://localhost:3000 again
5. If still stuck: Ctrl+C in terminal, restart server

### Issue: No power values showing
**Cause:** JavaScript error
**Fix:**
1. Press F12 (open developer console)
2. Look for red errors
3. Screenshot error
4. Restart server (Ctrl+C, then `npm start`)

### Issue: JWST won't rotate
**Cause:** Mouse button issue
**Fix:**
1. Left-click (not right-click)
2. Drag mouse while holding left button
3. Release to stop

---

## 🎓 Exam Presentation Tips

### What Examiners Want to See
1. ✅ JWST 3D model (visual proof)
2. ✅ Real-time power calculations
3. ✅ Eclipse mode toggle (shows battery backup)
4. ✅ HUD with live values
5. ✅ Clear explanation of P = V × I
6. ✅ Battery charging/discharging during eclipse
7. ✅ Professional UI (mission-control style)

### What NOT to Say
- ❌ "This is a game" (it's not, it's engineering tool)
- ❌ "I don't know what this number means"
- ❌ "The simulation is buggy" (it's not, explain what you see)
- ❌ "I can't explain eclipse" (you should, read the readme!)

### Key Phrases to Use
- ✅ "P = V × I, Power equals Voltage times Current"
- ✅ "Solar panel generates 4000 Watts in sunlight"
- ✅ "During eclipse, the 14 kWh battery powers the spacecraft"
- ✅ "Battery discharges at rate proportional to load power"
- ✅ "Voltage regulation converts 100V solar to 28V bus voltage"
- ✅ "This simulator uses first-year EECT concepts for clarity"

### Practice Run
1. Open simulator
2. Explain normal operation (2 minutes)
3. Toggle eclipse (2 minutes)
4. Click JWST biodata (1 minute)
5. Discuss with examiner (5 minutes)
**Total: 10 minutes - perfect demo length**

---

## 🌐 Accessing from Other Computers

If you want to view simulator from another PC on same WiFi:

1. Find your computer IP:
   ```cmd
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., 192.168.1.100)

2. On other computer, visit:
   ```
   http://192.168.1.100:3000
   ```

3. Make sure Windows Firewall allows Node.js:
   - Windows Defender Firewall
   - Allow an app → Find Node.js → Check "Private"

---

## 📱 Mobile/Tablet Access

ORBIT-EPS works on tablets but with limitations:
- ✅ Can view 3D model
- ✅ Can toggle eclipse
- ✅ Can read HUD values
- ⚠️ Touch controls less intuitive
- ❌ Better on desktop for presentations

---

## 🚀 Advanced Options

### Performance Tuning
If running slow, open `public/js/main.js` and change:

```javascript
// Line ~50, find:
app.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

// Change to:
app.renderer.setPixelRatio(1.0);  // Lower for slower systems
```

### Change Starfield
Edit `public/js/scene.js`, change:
```javascript
const starCount = 2000;  // Change to 1000 for fewer stars
```

### Modify Load Range
Edit `public/index.html`, find:
```html
<input type="range" id="load-slider" min="0" max="1000" value="300">
<!-- Change max="1000" to max="2000" for 2kW range -->
```

---

## ✨ You're Ready!

Your ORBIT-EPS simulator is now ready for:
- ✅ Educational presentations
- ✅ Exam demonstrations
- ✅ Learning electrical power systems
- ✅ Visualizing spacecraft operations
- ✅ Understanding JWST

**Good luck with your exam! 🎓**

---

## 📞 Need Help?

**Common Questions:**

Q: How do I stop the server?
A: Press `Ctrl+C` in the terminal

Q: Can I modify the code?
A: Yes! All files are editable. Changes appear after refresh.

Q: Will it work offline?
A: Partially. It needs Three.js from CDN initially, but works offline after first load.

Q: Can I use it on my laptop for presentations?
A: Yes! Just run `npm start` and open `http://localhost:3000` in browser.

Q: What if I mess up the code?
A: Download the files again from the repository.

---

**Enjoy exploring the James Webb Space Telescope! 🌌**
