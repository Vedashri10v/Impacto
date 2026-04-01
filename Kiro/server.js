const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Bluetooth Serial Port Configuration
let bluetoothPort = null;
let parser = null;

// Try to connect to HC-05 Bluetooth module
function initBluetoothConnection() {
  // List available ports
  SerialPort.list().then(ports => {
    console.log('Available serial ports:');
    ports.forEach(port => {
      console.log(`  - ${port.path}`);
    });
    
    // Try to find HC-05 (usually COM3, COM4, or similar on Windows)
    const hc05Port = ports.find(p => 
      p.path.includes('COM') || 
      p.manufacturer?.includes('HC-05') ||
      p.manufacturer?.includes('Bluetooth')
    );
    
    if (hc05Port) {
      connectToPort(hc05Port.path);
    } else {
      console.log('⚠️  HC-05 not found. Waiting for manual connection...');
      console.log('   You can manually trigger alerts via web interface');
    }
  }).catch(err => {
    console.log('⚠️  Serial port not available:', err.message);
    console.log('   System will work without Arduino (web triggers only)');
  });
}

function connectToPort(portPath) {
  try {
    bluetoothPort = new SerialPort({
      path: portPath,
      baudRate: 9600
    });
    
    parser = bluetoothPort.pipe(new ReadlineParser({ delimiter: '\n' }));
    
    bluetoothPort.on('open', () => {
      console.log('✅ Connected to HC-05 Bluetooth module on', portPath);
      io.emit('bluetooth-status', { connected: true, port: portPath });
    });
    
    parser.on('data', (data) => {
      const message = data.trim();
      console.log('📡 Received from Arduino:', message);
      
      // Check if FSR was triggered
      if (message.includes('FSR_TRIGGER') || message.includes('ACCIDENT')) {
        const sensorValue = message.match(/\d+/)?.[0] || 'unknown';
        console.log('🚨 FSR Sensor triggered! Value:', sensorValue);
        
        // Trigger alert on Site 1
        io.emit('arduino-trigger', {
          sensorId: 'fsr_001',
          value: sensorValue,
          timestamp: new Date().toISOString()
        });
      }
    });
    
    bluetoothPort.on('error', (err) => {
      console.error('❌ Bluetooth error:', err.message);
      io.emit('bluetooth-status', { connected: false, error: err.message });
    });
    
    bluetoothPort.on('close', () => {
      console.log('🔌 Bluetooth connection closed');
      io.emit('bluetooth-status', { connected: false });
      
      // Try to reconnect after 5 seconds
      setTimeout(() => {
        console.log('Attempting to reconnect...');
        initBluetoothConnection();
      }, 5000);
    });
    
  } catch (err) {
    console.error('❌ Failed to connect to port:', err.message);
  }
}

// Initialize Bluetooth on startup
initBluetoothConnection();

// Manual trigger endpoint (for testing without Arduino)
app.post('/api/trigger', (req, res) => {
  const { sensorId, value } = req.body;
  console.log('🔥 Manual trigger received:', { sensorId, value });
  
  io.emit('arduino-trigger', {
    sensorId: sensorId || 'manual',
    value: value || 'manual',
    timestamp: new Date().toISOString()
  });
  
  res.json({ success: true, message: 'Trigger sent to Site 1' });
});

// Emergency response endpoint
app.post('/api/emergency', (req, res) => {
  const { response, timestamp } = req.body;
  console.log('🚨 Emergency response:', response);
  
  if (response === 'YES') {
    // Send alert to Site 2
    io.emit('emergency-alert', {
      status: 'emergency',
      timestamp: timestamp || new Date().toISOString(),
      message: 'ACCIDENT CONFIRMED - Medical assistance required'
    });
  } else {
    console.log('✅ False alarm - No emergency');
  }
  
  res.json({ success: true });
});

// WebSocket connections
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
  
  socket.on('test-trigger', () => {
    console.log('🧪 Test trigger from client');
    io.emit('arduino-trigger', {
      sensorId: 'test',
      value: 'test',
      timestamp: new Date().toISOString()
    });
  });
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'site1.html'));
});

app.get('/site2', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'site2.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('');
  console.log('🚨 ========================================');
  console.log('   Arduino Accident Alert System');
  console.log('   ========================================');
  console.log('');
  console.log(`   🌐 Site 1 (Monitor): http://localhost:${PORT}`);
  console.log(`   🏥 Site 2 (Hospital): http://localhost:${PORT}/site2`);
  console.log('');
  console.log('   📡 Bluetooth: Listening for HC-05...');
  console.log('');
  console.log('   Press Ctrl+C to stop');
  console.log('========================================');
  console.log('');
});