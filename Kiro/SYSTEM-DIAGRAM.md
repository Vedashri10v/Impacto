# System Architecture Diagram

## Complete System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                     ARDUINO ACCIDENT ALERT SYSTEM                    │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│   HARDWARE       │
│   LAYER          │
└──────────────────┘
        │
        ├─── FSR Sensor (Force Sensitive Resistor)
        │    └─── Detects pressure/impact
        │
        ├─── Arduino Uno/Nano
        │    ├─── Reads FSR analog value (A0)
        │    ├─── Compares with threshold
        │    └─── Sends trigger via SoftwareSerial
        │
        └─── HC-05 Bluetooth Module
             ├─── Receives data from Arduino (TX→RX)
             ├─── Transmits to computer (RX→TX)
             └─── Wireless communication (9600 baud)

                        ↓ Bluetooth Signal

┌──────────────────┐
│   COMMUNICATION  │
│   LAYER          │
└──────────────────┘
        │
        └─── Computer Bluetooth Receiver
             ├─── Pairs with HC-05
             ├─── Creates virtual COM port
             └─── Receives serial data

                        ↓ Serial Data

┌──────────────────┐
│   SERVER         │
│   LAYER          │
└──────────────────┘
        │
        └─── Node.js Server (server.js)
             ├─── SerialPort: Reads Bluetooth COM port
             ├─── Express: HTTP server (port 3000)
             ├─── Socket.IO: WebSocket server
             ├─── Auto-detects HC-05
             └─── Broadcasts events to clients

                        ↓ WebSocket Events

┌──────────────────┐
│   CLIENT         │
│   LAYER          │
└──────────────────┘
        │
        ├─── Site 1 (Emergency Detection)
        │    ├─── Receives 'arduino-trigger' event
        │    ├─── Shows popup with countdown
        │    ├─── Handles user response (YES/NO)
        │    └─── Sends response to server
        │
        └─── Site 2 (Hospital Display)
             ├─── Receives 'emergency-alert' event
             ├─── Shows full-screen alert
             ├─── Plays alert sound
             └─── Cannot be closed
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          NORMAL OPERATION                            │
└─────────────────────────────────────────────────────────────────────┘

1. FSR Pressed
   │
   ├─→ Arduino reads analog value
   │   └─→ Value > THRESHOLD?
   │       ├─→ NO: Continue monitoring
   │       └─→ YES: Proceed to step 2
   │
2. Arduino sends via Bluetooth
   │   Format: "FSR_TRIGGER:xxx"
   │   └─→ HC-05 transmits wirelessly
   │
3. Computer receives
   │   └─→ Virtual COM port receives data
   │
4. Server processes
   │   ├─→ SerialPort reads data
   │   ├─→ Parses "FSR_TRIGGER"
   │   └─→ Emits 'arduino-trigger' event
   │
5. Site 1 receives event
   │   ├─→ Shows emergency popup
   │   ├─→ Starts 60-second countdown
   │   └─→ Waits for user response
   │
6. User Response
   │
   ├─→ Option A: User clicks YES
   │   ├─→ Sends POST /api/emergency (response: YES)
   │   ├─→ Server emits 'emergency-alert'
   │   └─→ Site 2 shows alert
   │
   ├─→ Option B: User clicks NO
   │   ├─→ Sends POST /api/emergency (response: NO)
   │   ├─→ Alert cancelled
   │   └─→ System returns to monitoring
   │
   └─→ Option C: Timeout (60 seconds)
       ├─→ Auto-sends YES response
       ├─→ Server emits 'emergency-alert'
       └─→ Site 2 shows alert

┌─────────────────────────────────────────────────────────────────────┐
│                        EMERGENCY ALERT FLOW                          │
└─────────────────────────────────────────────────────────────────────┘

Site 1 (YES/Timeout)
   │
   └─→ POST /api/emergency
       │
       └─→ Server
           │
           └─→ Socket.IO emit 'emergency-alert'
               │
               └─→ Site 2
                   ├─→ Hide waiting screen
                   ├─→ Show alert screen
                   ├─→ Play alert sound
                   ├─→ Flash page title
                   └─→ Prevent page close
```

## Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                      COMPONENT INTERACTIONS                          │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Arduino    │ Serial  │    HC-05     │Bluetooth│   Computer   │
│   + FSR      │────────→│   Module     │────────→│   Bluetooth  │
└──────────────┘  9600   └──────────────┘         └──────────────┘
                                                           │
                                                           │ COM Port
                                                           ↓
                                                   ┌──────────────┐
                                                   │   Node.js    │
                                                   │   Server     │
                                                   └──────────────┘
                                                           │
                                                           │ WebSocket
                                    ┌──────────────────────┼──────────────────────┐
                                    │                      │                      │
                                    ↓                      ↓                      ↓
                            ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
                            │   Site 1     │      │   Site 2     │      │   Site N     │
                            │  (Monitor)   │      │  (Hospital)  │      │   (Future)   │
                            └──────────────┘      └──────────────┘      └──────────────┘
```

## State Diagram - Site 1

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SITE 1 STATES                                │
└─────────────────────────────────────────────────────────────────────┘

                    ┌──────────────────┐
                    │   MONITORING     │
                    │   (Ready State)  │
                    └──────────────────┘
                            │
                            │ arduino-trigger event
                            ↓
                    ┌──────────────────┐
                    │   POPUP SHOWN    │
                    │  (Countdown: 60) │
                    └──────────────────┘
                            │
                ┌───────────┼───────────┐
                │           │           │
         User   │    Timer  │    User   │
         clicks │   expires │   clicks  │
         YES    │           │    NO     │
                ↓           ↓           ↓
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │EMERGENCY │ │EMERGENCY │ │ CANCELLED│
        │CONFIRMED │ │AUTO-SENT │ │          │
        └──────────┘ └──────────┘ └──────────┘
                │           │           │
                └───────────┴───────────┘
                            │
                            ↓
                    ┌──────────────────┐
                    │   MONITORING     │
                    │  (Return to      │
                    │   Ready State)   │
                    └──────────────────┘
```

## State Diagram - Site 2

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SITE 2 STATES                                │
└─────────────────────────────────────────────────────────────────────┘

                    ┌──────────────────┐
                    │    WAITING       │
                    │  (Monitoring)    │
                    │  - Show loader   │
                    │  - Update status │
                    └──────────────────┘
                            │
                            │ emergency-alert event
                            ↓
                    ┌──────────────────┐
                    │  ALERT ACTIVE    │
                    │  - Full screen   │
                    │  - Play sound    │
                    │  - Flash title   │
                    │  - Prevent close │
                    └──────────────────┘
                            │
                            │ (Manual clear or
                            │  system reset)
                            ↓
                    ┌──────────────────┐
                    │    WAITING       │
                    │  (Return to      │
                    │   Monitoring)    │
                    └──────────────────┘
```

## Network Protocol

```
┌─────────────────────────────────────────────────────────────────────┐
│                      WEBSOCKET EVENTS                                │
└─────────────────────────────────────────────────────────────────────┘

Server → Client Events:
├─→ 'connect'
│   └─→ Sent when client connects to server
│
├─→ 'disconnect'
│   └─→ Sent when client disconnects
│
├─→ 'bluetooth-status'
│   └─→ Data: { connected: boolean, port?: string, error?: string }
│
├─→ 'arduino-trigger'
│   └─→ Data: { sensorId: string, value: number, timestamp: string }
│
├─→ 'emergency-alert'
│   └─→ Data: { status: string, timestamp: string, message: string }
│
└─→ 'response-received'
    └─→ Data: { alertId: string, response: string, respondedAt: string }

Client → Server Events:
└─→ 'test-trigger'
    └─→ Triggers manual test alert

HTTP Endpoints:
├─→ POST /api/trigger
│   └─→ Body: { sensorId: string, value: number }
│
└─→ POST /api/emergency
    └─→ Body: { response: string, timestamp: string }
```

## Timing Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         TIMING SEQUENCE                              │
└─────────────────────────────────────────────────────────────────────┘

Time    Arduino    HC-05      Server     Site 1     Site 2
────────────────────────────────────────────────────────────────────
0.0s    FSR Press
0.1s    Read value
0.2s    Send BT ──→
0.3s               Transmit ──→
0.4s                          Receive
0.5s                          Parse
0.6s                          Emit ─────→ Receive
0.7s                                     Show popup
0.8s                                     Start timer
...
60.7s                                    Timeout!
60.8s                                    Send POST ──→
60.9s                          Receive
61.0s                          Emit ──────────────→ Receive
61.1s                                               Show alert
61.2s                                               Play sound
```

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                       ERROR HANDLING                                 │
└─────────────────────────────────────────────────────────────────────┘

Bluetooth Disconnection:
    HC-05 disconnects
    │
    └─→ Server detects error
        ├─→ Emit 'bluetooth-status' (connected: false)
        ├─→ Log error
        └─→ Wait 5 seconds
            └─→ Attempt reconnection
                ├─→ Success: Resume operation
                └─→ Fail: Retry after 5 seconds

WebSocket Disconnection:
    Client loses connection
    │
    └─→ Client detects disconnect
        ├─→ Show "Disconnected" status
        └─→ Socket.IO auto-reconnects
            ├─→ Success: Resume operation
            └─→ Fail: Keep retrying

FSR False Triggers:
    FSR triggers accidentally
    │
    └─→ Arduino debounce (2-second delay)
        └─→ Prevents multiple triggers

Server Crash:
    Server stops
    │
    ├─→ Clients show "Disconnected"
    └─→ Manual restart required
        └─→ npm start
```

## Scalability Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FUTURE SCALABILITY                                │
└─────────────────────────────────────────────────────────────────────┘

Current (Single System):
    1 Arduino → 1 Server → 1 Site 1 + 1 Site 2

Future (Multiple Sensors):
    Arduino 1 (FSR 1) ─┐
    Arduino 2 (FSR 2) ─┼─→ Server ─┬─→ Site 1 (Monitor)
    Arduino 3 (FSR 3) ─┘            ├─→ Site 2 (Hospital 1)
                                    ├─→ Site 3 (Hospital 2)
                                    └─→ Site N (Hospital N)

Enterprise (Cloud):
    Multiple Locations
    │
    ├─→ Location A: Arduino → Gateway → Cloud
    ├─→ Location B: Arduino → Gateway → Cloud
    └─→ Location C: Arduino → Gateway → Cloud
                                    │
                                    └─→ Cloud Server
                                        ├─→ Database
                                        ├─→ Web Dashboard
                                        ├─→ Mobile Apps
                                        └─→ SMS/Email Alerts
```

---

**This diagram shows the complete system architecture from hardware to software layers.**