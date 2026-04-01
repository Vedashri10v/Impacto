# Troubleshooting Guide

## 🔍 Common Issues and Solutions

### 1. Bluetooth/HC-05 Issues

#### "HC-05 not found" or "Bluetooth not connecting"

**Symptoms:**
- Server shows "HC-05 not found"
- Site 1 shows "Bluetooth: Disconnected"

**Solutions:**
1. **Check if HC-05 is paired:**
   - Windows Settings → Bluetooth & devices
   - Should see "HC-05" as "Connected"
   - If not, click "Add device" and pair (PIN: 1234 or 0000)

2. **Find COM port:**
   - Device Manager → Ports (COM & LPT)
   - Look for "Standard Serial over Bluetooth link (COMx)"
   - Note the COM number (e.g., COM3)

3. **Manually specify COM port:**
   - Edit `server.js` around line 30
   - Change to: `connectToPort('COM3');` (use your COM port)

4. **Check HC-05 power:**
   - HC-05 LED should be blinking
   - If not, check VCC and GND connections
   - Verify 5V power supply

5. **Restart Bluetooth:**
   ```bash
   # Stop server (Ctrl+C)
   # Unpair HC-05 in Windows
   # Re-pair HC-05
   # Restart server
   npm start
   ```

#### "Bluetooth keeps disconnecting"

**Solutions:**
- Check HC-05 power supply (use external 5V if needed)
- Reduce distance between HC-05 and computer
- Check for interference (WiFi routers, other Bluetooth devices)
- Verify voltage divider on RX pin (should be 3.3V)
- Server auto-reconnects every 5 seconds

---

### 2. Arduino Issues

#### "FSR not triggering"

**Symptoms:**
- Pressing FSR doesn't trigger alert
- Serial Monitor shows no change in value

**Solutions:**
1. **Test FSR with Serial Monitor:**
   ```cpp
   void loop() {
     int value = analogRead(A0);
     Serial.println(value);
     delay(100);
   }
   ```
   - Should see value increase when pressed
   - If no change, check wiring

2. **Adjust sensitivity:**
   - Edit `arduino_fsr_hc05.ino`
   - Lower THRESHOLD value:
   ```cpp
   const int THRESHOLD = 300;  // Try lower values
   ```

3. **Check FSR wiring:**
   - FSR Leg 1 → 5V ✓
   - FSR Leg 2 → A0 AND 10KΩ to GND ✓
   - Use multimeter to verify connections

4. **Test FSR resistance:**
   - Unpressed: ~10MΩ (very high)
   - Pressed: 1KΩ - 10KΩ (lower)
   - If always high/low, FSR may be damaged

#### "Arduino not uploading"

**Solutions:**
- Select correct board (Tools → Board)
- Select correct COM port (Tools → Port)
- Close Serial Monitor before uploading
- Try different USB cable
- Press reset button on Arduino

#### "Serial Monitor shows garbage"

**Solutions:**
- Check baud rate (should be 9600)
- Both Serial.begin() and bluetooth.begin() should be 9600
- Verify HC-05 baud rate (default 9600)

---

### 3. Server Issues

#### "Cannot find module 'express'" or similar

**Symptoms:**
- Server won't start
- Error: "Cannot find module..."

**Solutions:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install

# Or install specific package
npm install express socket.io cors serialport
```

#### "Error: Cannot find module 'serialport'"

**Solutions:**
```bash
# Install serialport with native build
npm install serialport --save

# If that fails, try:
npm install serialport --build-from-source

# Windows may need:
npm install --global windows-build-tools
npm install serialport
```

#### "Port 3000 already in use"

**Solutions:**
1. **Kill process using port 3000:**
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

2. **Use different port:**
   - Edit `server.js`
   - Change: `const PORT = 3001;`

#### "WebSocket connection failed"

**Solutions:**
- Check if server is running
- Verify port 3000 is accessible
- Check firewall settings
- Try different browser
- Check browser console for errors (F12)

---

### 4. Website Issues

#### "Site 1 not showing popup"

**Symptoms:**
- FSR triggers but no popup appears
- Test button doesn't work

**Solutions:**
1. **Check browser console (F12):**
   - Look for JavaScript errors
   - Check WebSocket connection status

2. **Verify WebSocket connection:**
   - Should see "Connected to server" in logs
   - If not, check server is running

3. **Clear browser cache:**
   - Ctrl+Shift+Delete
   - Clear cached files
   - Refresh page (Ctrl+F5)

4. **Check popup overlay:**
   - Open browser DevTools (F12)
   - Check if popup element exists
   - Verify CSS display property

#### "Site 2 not receiving alerts"

**Symptoms:**
- Site 1 popup works
- Site 2 stays in "Monitoring" state

**Solutions:**
1. **Check WebSocket connection:**
   - Open browser console on Site 2
   - Should see "Connected to server"

2. **Verify both sites are open:**
   - Site 1: http://localhost:3000
   - Site 2: http://localhost:3000/site2

3. **Check server logs:**
   - Should see "emergency-alert" event
   - Verify emergency response is sent

4. **Test with manual trigger:**
   - Click "Test Emergency Alert" on Site 1
   - Should trigger Site 2

#### "Alert sound not playing"

**Solutions:**
- Browser may block autoplay
- Click anywhere on Site 2 first
- Check browser sound settings
- Verify audio element in HTML
- Try different browser

---

### 5. Hardware Issues

#### "HC-05 LED not blinking"

**Solutions:**
- Check VCC connection (should be 5V)
- Check GND connection
- Verify HC-05 is not damaged
- Try different power source
- Check if HC-05 is in AT mode (should be in data mode)

#### "Voltage divider not working"

**Symptoms:**
- HC-05 gets hot
- HC-05 stops working
- Erratic behavior

**Solutions:**
1. **Verify resistor values:**
   - 1KΩ (Brown-Black-Red)
   - 2KΩ (Red-Black-Red)

2. **Measure voltage at HC-05 RX:**
   - Should be ~3.3V when Pin 11 is HIGH
   - If 5V, HC-05 may be damaged

3. **Alternative: Use 3.3V power:**
   - Connect HC-05 VCC to Arduino 3.3V
   - Connect HC-05 RX directly to Pin 11
   - May have reduced range

#### "FSR values erratic"

**Solutions:**
- Check 10KΩ pull-down resistor
- Verify FSR connections are secure
- Add 0.1µF capacitor across FSR for stability
- Check for loose breadboard connections

---

### 6. System Integration Issues

#### "Everything works separately but not together"

**Solutions:**
1. **Test each component:**
   - Arduino FSR → Serial Monitor ✓
   - HC-05 Bluetooth → Bluetooth terminal ✓
   - Server → Manual trigger ✓
   - Site 1 → Test button ✓
   - Site 2 → Manual alert ✓

2. **Check data flow:**
   - Arduino Serial Monitor: Should show "FSR_TRIGGER:xxx"
   - Server logs: Should show "Received from Arduino"
   - Site 1 logs: Should show "FSR Sensor triggered"
   - Site 2 console: Should show "EMERGENCY ALERT"

3. **Verify timing:**
   - FSR press → Immediate Arduino response
   - Arduino → HC-05 → Computer (< 1 second)
   - Server → Site 1 (< 1 second)
   - Site 1 → Site 2 (after YES or 60 seconds)

---

## 🔧 Diagnostic Commands

### Check Node.js and npm:
```bash
node --version
npm --version
```

### Check installed packages:
```bash
npm list
```

### Check serial ports:
```bash
node -e "const {SerialPort} = require('serialport'); SerialPort.list().then(ports => console.log(ports));"
```

### Test server without Arduino:
```bash
# Start server
npm start

# In another terminal, test trigger:
curl -X POST http://localhost:3000/api/trigger -H "Content-Type: application/json" -d "{\"sensorId\":\"test\",\"value\":999}"
```

---

## 📊 Debug Checklist

Use this checklist to systematically debug:

### Hardware:
- [ ] Arduino powers on (LED lights up)
- [ ] FSR connected correctly
- [ ] HC-05 LED blinking
- [ ] Voltage divider in place
- [ ] All connections secure

### Arduino:
- [ ] Code uploads successfully
- [ ] Serial Monitor shows "System ready!"
- [ ] FSR values change when pressed
- [ ] Bluetooth sends data

### Bluetooth:
- [ ] HC-05 paired in Windows
- [ ] COM port identified
- [ ] Server detects HC-05
- [ ] Connection stable

### Server:
- [ ] npm install completed
- [ ] Server starts without errors
- [ ] Port 3000 accessible
- [ ] WebSocket running

### Websites:
- [ ] Site 1 loads
- [ ] Site 2 loads
- [ ] WebSocket connected
- [ ] Test button works
- [ ] Logs show activity

### Integration:
- [ ] FSR triggers Arduino
- [ ] Arduino sends to HC-05
- [ ] Server receives data
- [ ] Site 1 shows popup
- [ ] Site 2 receives alert

---

## 🆘 Still Having Issues?

### Collect Debug Information:

1. **Arduino Serial Monitor output**
2. **Server terminal output**
3. **Browser console logs (F12)**
4. **Device Manager screenshot (COM ports)**
5. **Photo of wiring**

### Check These Files:

- `server.js` - Server configuration
- `arduino_fsr_hc05.ino` - Arduino code
- `public/site1.js` - Site 1 logic
- `public/site2.js` - Site 2 logic

### Common Mistakes:

- ❌ Forgot voltage divider for HC-05 RX
- ❌ Wrong COM port
- ❌ HC-05 not paired
- ❌ Wrong baud rate
- ❌ FSR wired backwards
- ❌ Missing 10KΩ resistor
- ❌ Server not running
- ❌ Wrong URL for sites

---

## 💡 Pro Tips

1. **Always check Serial Monitor first** - It shows Arduino status
2. **Use browser DevTools** - Console shows JavaScript errors
3. **Check server logs** - Shows all communication
4. **Test components individually** - Isolate the problem
5. **Verify connections with multimeter** - Measure voltages
6. **Keep HC-05 close to computer** - Bluetooth range issues
7. **Restart everything** - Sometimes it just works

---

**If all else fails, start from scratch with SETUP-GUIDE.md**