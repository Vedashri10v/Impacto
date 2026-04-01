# Arduino FSR Accident Alert System with HC-05 Bluetooth

Complete accident detection and alert system using Arduino FSR sensor, HC-05 Bluetooth module, and dual web interfaces.

## 🎯 System Overview

```
Arduino FSR Sensor → HC-05 Bluetooth → Computer → Site 1 (Popup) → Site 2 (Hospital Alert)
```

### How It Works:
1. **FSR Sensor** detects pressure/impact on Arduino
2. **Arduino** sends signal via **HC-05 Bluetooth** to computer
3. **Site 1** receives trigger and shows emergency popup (60-second countdown)
4. User responds YES/NO or timeout occurs
5. If YES or timeout → **Site 2** (Hospital Display) shows emergency alert
6. If NO → Alert cancelled

## 🔧 Hardware Requirements

### Components:
- Arduino Uno/Nano/Mega
- FSR (Force Sensitive Resistor) sensor
- HC-05 Bluetooth module
- 10KΩ resistor (for FSR)
- 1KΩ and 2KΩ resistors (voltage divider for HC-05 RX)
- Breadboard and jumper wires

### Wiring Diagram:

```
FSR Sensor:
  FSR Leg 1 → 5V
  FSR Leg 2 → A0 + 10KΩ resistor → GND

HC-05 Bluetooth Module:
  VCC → 5V
  GND → GND
  TX  → Arduino Pin 10 (RX)
  RX  → Arduino Pin 11 (TX) through voltage divider
  
Voltage Divider for HC-05 RX (3.3V):
  Arduino Pin 11 → 1KΩ → HC-05 RX → 2KΩ → GND
```

## 💻 Software Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Pair HC-05 Bluetooth Module

**Windows:**
1. Open Settings → Bluetooth & devices
2. Add device → Bluetooth
3. Find "HC-05" (default PIN: 1234 or 0000)
4. Pair the device
5. Note the COM port (e.g., COM3, COM4)

**The server will auto-detect the HC-05 COM port**

### 3. Upload Arduino Code

1. Open `arduino_fsr_hc05.ino` in Arduino IDE
2. Select your board and port
3. Upload the code
4. Open Serial Monitor (9600 baud) to verify it's working

### 4. Start the Server

```bash
npm start
```

The server will:
- Auto-detect HC-05 Bluetooth connection
- Start web server on port 3000
- Listen for Arduino triggers

## 🌐 Web Interfaces

### Site 1 - Emergency Detection Monitor
**URL:** `http://localhost:3000`

Features:
- Real-time Bluetooth connection status
- Arduino FSR sensor status
- Emergency popup with 60-second countdown
- Manual test trigger button
- System logs

### Site 2 - Hospital Emergency Display
**URL:** `http://localhost:3000/site2`

Features:
- Waiting/monitoring state
- Full-screen emergency alert
- Alert sound
- Cannot be closed during emergency
- Timestamp display

## 🧪 Testing

### Test Without Arduino:
1. Open Site 1: `http://localhost:3000`
2. Click "🧪 Test Emergency Alert" button
3. Popup appears with 60-second countdown
4. Open Site 2 in another tab: `http://localhost:3000/site2`
5. Click YES or wait for timeout
6. Site 2 shows emergency alert

### Test With Arduino:
1. Ensure HC-05 is paired and connected
2. Start the server: `npm start`
3. Open both sites
4. Press the FSR sensor
5. Watch the alert flow through the system

## 📡 Bluetooth Troubleshooting

### HC-05 Not Detected:
1. Check if HC-05 is paired in Windows Bluetooth settings
2. Verify COM port in Device Manager
3. Check wiring connections
4. Restart the server

### Connection Drops:
- Server auto-reconnects every 5 seconds
- Check power supply to HC-05
- Ensure HC-05 is within range

### Manual COM Port:
Edit `server.js` line ~30 to specify COM port:
```javascript
connectToPort('COM3'); // Replace with your COM port
```

## 🎨 Customization

### Adjust FSR Sensitivity:
Edit `arduino_fsr_hc05.ino`:
```cpp
const int THRESHOLD = 500;  // Lower = more sensitive
```

### Change Countdown Time:
Edit `public/site1.js`:
```javascript
let timeLeft = 60;  // Seconds
```

### Modify Alert Sound:
Replace audio source in `public/site2.html`

## 📁 Project Structure

```
arduino-accident-alert-system/
├── server.js                 # Main server with Bluetooth
├── package.json             # Dependencies
├── arduino_fsr_hc05.ino     # Arduino code
├── public/
│   ├── site1.html          # Emergency detection interface
│   ├── site1.js            # Site 1 logic
│   ├── site2.html          # Hospital display
│   └── site2.js            # Site 2 logic
└── README.md               # This file
```

## 🔒 Security Notes

- System uses WebSocket for real-time communication
- No authentication (add if deploying publicly)
- Bluetooth connection is local only
- CORS enabled for development

## 🚀 Deployment

For production deployment:
1. Add authentication
2. Use HTTPS
3. Configure firewall rules
4. Set up proper logging
5. Add database for alert history

## 📝 License

MIT License - Free to use and modify

## 🆘 Support

Common issues:
- **Bluetooth not connecting**: Check pairing and COM port
- **Site 2 not receiving alerts**: Check WebSocket connection
- **FSR not triggering**: Adjust THRESHOLD value
- **Serial port errors**: Install serialport native dependencies

## 🎯 Future Enhancements

- [ ] Multiple FSR sensors
- [ ] GPS location tracking
- [ ] SMS/Email notifications
- [ ] Alert history database
- [ ] Mobile app integration
- [ ] Multiple hospital displays

---

**Made with ❤️ for emergency response systems**