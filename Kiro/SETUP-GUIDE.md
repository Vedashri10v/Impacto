# Quick Setup Guide

## 🚀 5-Minute Setup

### Step 1: Hardware Setup (5 minutes)

1. **Connect FSR Sensor to Arduino:**
   ```
   FSR Leg 1 → Arduino 5V
   FSR Leg 2 → Arduino A0 AND 10KΩ resistor to GND
   ```

2. **Connect HC-05 Bluetooth Module:**
   ```
   HC-05 VCC → Arduino 5V
   HC-05 GND → Arduino GND
   HC-05 TX  → Arduino Pin 10
   HC-05 RX  → Voltage Divider → Arduino Pin 11
   ```

3. **Voltage Divider for HC-05 RX (IMPORTANT!):**
   ```
   Arduino Pin 11 → 1KΩ resistor → HC-05 RX
   HC-05 RX → 2KΩ resistor → GND
   ```
   (This protects HC-05 which needs 3.3V, not 5V)

### Step 2: Upload Arduino Code (2 minutes)

1. Open Arduino IDE
2. Open `arduino_fsr_hc05.ino`
3. Select your Arduino board (Tools → Board)
4. Select COM port (Tools → Port)
5. Click Upload
6. Open Serial Monitor (9600 baud) to verify

### Step 3: Pair Bluetooth (2 minutes)

**Windows:**
1. Settings → Bluetooth & devices
2. Add device → Bluetooth
3. Select "HC-05"
4. Enter PIN: `1234` or `0000`
5. Wait for "Connected"

**Note the COM port** (e.g., COM3) - you can find it in:
- Device Manager → Ports (COM & LPT)

### Step 4: Install & Run Server (3 minutes)

```bash
# Install dependencies
npm install

# Start server
npm start
```

Server will auto-detect HC-05 and start on port 3000.

### Step 5: Test the System (2 minutes)

1. **Open Site 1:** `http://localhost:3000`
   - Should show "Bluetooth: Connected"
   - Should show "Arduino FSR: Waiting for signal"

2. **Open Site 2:** `http://localhost:3000/site2` (in new tab/window)
   - Should show "Monitoring for Alerts..."

3. **Test without Arduino:**
   - Click "🧪 Test Emergency Alert" on Site 1
   - Popup appears with countdown
   - Click YES or wait 60 seconds
   - Site 2 shows emergency alert!

4. **Test with Arduino:**
   - Press FSR sensor firmly
   - Watch Site 1 popup appear
   - Site 2 receives alert

## ✅ Verification Checklist

- [ ] Arduino uploads successfully
- [ ] Serial Monitor shows "System ready!"
- [ ] HC-05 paired in Windows Bluetooth
- [ ] `npm install` completes without errors
- [ ] Server starts and shows "Bluetooth: Listening for HC-05..."
- [ ] Site 1 opens and shows connection status
- [ ] Site 2 opens and shows monitoring screen
- [ ] Test button triggers popup on Site 1
- [ ] Pressing FSR triggers popup on Site 1
- [ ] YES/timeout sends alert to Site 2

## 🐛 Common Issues

### "HC-05 not found"
- Check if HC-05 is paired in Windows
- Verify HC-05 power (LED should blink)
- Check wiring connections

### "Module not found: serialport"
- Run: `npm install serialport --save`
- May need: `npm install --build-from-source`

### "FSR not triggering"
- Check FSR wiring
- Adjust THRESHOLD in Arduino code (lower = more sensitive)
- Test FSR with Serial Monitor

### "Site 2 not receiving alerts"
- Check if both sites are open
- Check browser console for errors
- Verify WebSocket connection

### "Bluetooth keeps disconnecting"
- Check HC-05 power supply
- Ensure HC-05 is within range
- Check voltage divider on RX pin

## 📞 Need Help?

1. Check Serial Monitor for Arduino debug messages
2. Check browser console (F12) for JavaScript errors
3. Check server terminal for connection logs
4. Verify all wiring with multimeter

## 🎯 Next Steps

Once working:
- Adjust FSR sensitivity for your use case
- Customize alert messages
- Add multiple FSR sensors
- Deploy to production server
- Add SMS/email notifications

---

**Total Setup Time: ~15 minutes**