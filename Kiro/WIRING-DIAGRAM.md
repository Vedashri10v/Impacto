# Wiring Diagram - Arduino FSR + HC-05 Bluetooth

## Complete Circuit Diagram

```
                    Arduino Uno/Nano
                    ┌─────────────┐
                    │             │
    FSR Sensor      │         5V  ├──┬─── FSR Leg 1
    ┌────────┐      │             │  │
    │        │      │         GND ├──┼─── GND Rail
    │  FSR   │      │             │  │
    │        │      │         A0  ├──┤
    └────────┘      │             │  │
                    │         13  │  │    (Built-in LED)
                    │             │  │
    HC-05 Module    │         10  ├──┼─── HC-05 TX
    ┌────────┐      │             │  │
    │  VCC   ├──────┼─────────────┘  │
    │  GND   ├──────┼────────────────┘
    │  TX    ├──────┤                 
    │  RX    ├──────┤ (via divider)   
    └────────┘      │         11  │
                    │             │
                    └─────────────┘

Breadboard Layout:
┌─────────────────────────────────────┐
│  Power Rails                        │
│  + ─────────────────────────────    │ ← 5V
│  - ─────────────────────────────    │ ← GND
│                                     │
│  FSR Circuit:                       │
│  5V ──── FSR ──┬── A0               │
│                └── 10KΩ ── GND      │
│                                     │
│  HC-05 Voltage Divider:             │
│  Pin 11 ── 1KΩ ──┬── HC-05 RX      │
│                  └── 2KΩ ── GND    │
└─────────────────────────────────────┘
```

## Detailed Connections

### FSR Sensor (Force Sensitive Resistor)

| FSR Pin | Connection | Notes |
|---------|------------|-------|
| Leg 1 | Arduino 5V | Power supply |
| Leg 2 | Arduino A0 + 10KΩ to GND | Analog input with pull-down |

**FSR Circuit Explanation:**
- Creates voltage divider
- Resistance decreases when pressed
- Voltage at A0 increases with pressure
- 10KΩ resistor pulls to GND when not pressed

### HC-05 Bluetooth Module

| HC-05 Pin | Arduino Pin | Notes |
|-----------|-------------|-------|
| VCC | 5V | Power (can use 3.3V-6V) |
| GND | GND | Ground |
| TX | Pin 10 | HC-05 transmit → Arduino receive |
| RX | Pin 11 (via divider) | HC-05 receive ← Arduino transmit |
| STATE | Not connected | Optional status LED |
| EN | Not connected | Optional enable pin |

**⚠️ CRITICAL: Voltage Divider for HC-05 RX**

HC-05 RX pin is 3.3V tolerant, but Arduino outputs 5V!

```
Arduino Pin 11 (5V) ──[1KΩ]──┬── HC-05 RX (3.3V)
                             │
                           [2KΩ]
                             │
                            GND

Voltage at HC-05 RX = 5V × (2KΩ / (1KΩ + 2KΩ)) = 3.33V ✓
```

**Without voltage divider = DAMAGED HC-05!**

## Component List

### Required Components:
- [ ] 1× Arduino Uno/Nano/Mega
- [ ] 1× FSR (Force Sensitive Resistor)
- [ ] 1× HC-05 Bluetooth Module
- [ ] 1× 10KΩ resistor (for FSR)
- [ ] 1× 1KΩ resistor (for voltage divider)
- [ ] 1× 2KΩ resistor (for voltage divider)
- [ ] 1× Breadboard
- [ ] Jumper wires (male-to-male)
- [ ] USB cable (for Arduino)

### Optional Components:
- [ ] LED + 220Ω resistor (external indicator)
- [ ] Push button (for manual testing)
- [ ] Enclosure/case
- [ ] Power supply (9V battery or wall adapter)

## Assembly Steps

### Step 1: Power Rails
1. Connect Arduino 5V to breadboard + rail
2. Connect Arduino GND to breadboard - rail

### Step 2: FSR Sensor
1. Insert FSR into breadboard
2. Connect FSR Leg 1 to + rail (5V)
3. Connect FSR Leg 2 to Arduino A0
4. Connect 10KΩ resistor from FSR Leg 2 to - rail (GND)

### Step 3: HC-05 Module
1. Insert HC-05 into breadboard (or use jumper wires)
2. Connect HC-05 VCC to + rail (5V)
3. Connect HC-05 GND to - rail (GND)
4. Connect HC-05 TX directly to Arduino Pin 10

### Step 4: Voltage Divider for HC-05 RX
1. Connect Arduino Pin 11 to 1KΩ resistor
2. Connect other end of 1KΩ to HC-05 RX
3. Connect 2KΩ resistor from HC-05 RX to - rail (GND)

### Step 5: Verification
1. Double-check all connections
2. Verify voltage divider resistor values
3. Ensure no short circuits
4. Check polarity of components

## Testing Connections

### Test 1: Power
- Upload a simple blink sketch
- HC-05 LED should blink (pairing mode)
- FSR should have voltage at A0

### Test 2: FSR
```cpp
void setup() {
  Serial.begin(9600);
}

void loop() {
  int value = analogRead(A0);
  Serial.println(value);
  delay(100);
}
```
- Open Serial Monitor
- Press FSR → value should increase
- Release FSR → value should decrease

### Test 3: Bluetooth
```cpp
#include <SoftwareSerial.h>
SoftwareSerial BT(10, 11);

void setup() {
  Serial.begin(9600);
  BT.begin(9600);
  Serial.println("Bluetooth test");
}

void loop() {
  if (BT.available()) {
    Serial.write(BT.read());
  }
  if (Serial.available()) {
    BT.write(Serial.read());
  }
}
```
- Pair HC-05 with computer
- Open Serial Monitor
- Type message → should appear on Bluetooth terminal

## Troubleshooting

### FSR Not Working
- Check if FSR is connected correctly
- Verify 10KΩ resistor is in place
- Test with multimeter: resistance should change when pressed

### HC-05 Not Responding
- Check power connections (LED should blink)
- Verify voltage divider resistors
- Try swapping TX/RX connections
- Check baud rate (default 9600)

### Intermittent Connection
- Check loose wires
- Verify breadboard connections
- Use shorter jumper wires
- Check power supply stability

## Safety Notes

⚠️ **Important:**
- Never connect 5V directly to HC-05 RX
- Double-check voltage divider before powering on
- Use proper resistor values (color codes)
- Avoid short circuits
- Disconnect power when wiring

## Alternative Wiring (Without Voltage Divider)

If you don't have resistors for voltage divider:

**Option 1:** Use Arduino 3.3V output
- Connect HC-05 VCC to Arduino 3.3V (not 5V)
- Connect HC-05 RX directly to Arduino Pin 11
- Note: May have reduced range

**Option 2:** Use logic level converter
- Use bi-directional logic level converter module
- Converts 5V ↔ 3.3V safely

---

**Always verify connections before powering on!**