// Site 1 - Emergency Detection System with Arduino + HC-05 Bluetooth
const socket = io();

// DOM Elements
const popupOverlay = document.getElementById('popupOverlay');
const countdown = document.getElementById('countdown');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const testBtn = document.getElementById('testBtn');
const systemStatus = document.getElementById('systemStatus');
const systemText = document.getElementById('systemText');
const bluetoothStatus = document.getElementById('bluetoothStatus');
const bluetoothText = document.getElementById('bluetoothText');
const arduinoStatus = document.getElementById('arduinoStatus');
const arduinoText = document.getElementById('arduinoText');
const logContainer = document.getElementById('logContainer');

let timeLeft = 60;
let countdownInterval = null;
let currentAlertTimestamp = null;

// Add log entry
function addLog(message, type = 'info') {
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    
    const time = new Date().toLocaleTimeString();
    const logClass = type === 'alert' ? 'log-alert' : type === 'success' ? 'log-success' : 'log-message';
    
    logEntry.innerHTML = `
        <span class="log-time">[${time}]</span>
        <span class="${logClass}"> ${message}</span>
    `;
    
    logContainer.prepend(logEntry);
    
    // Keep only last 50 logs
    const logs = logContainer.querySelectorAll('.log-entry');
    if (logs.length > 50) {
        logs[logs.length - 1].remove();
    }
}

// Update status card
function updateStatus(card, icon, text, active = false) {
    const cardElement = document.getElementById(card);
    const iconElement = cardElement.querySelector('.status-icon');
    const textElement = document.getElementById(text);
    
    iconElement.textContent = icon;
    
    if (active) {
        cardElement.classList.add('active');
    } else {
        cardElement.classList.remove('active');
    }
}

// Socket.IO Events
socket.on('connect', () => {
    addLog('Connected to server', 'success');
    updateStatus('systemStatus', '✅', 'systemText', true);
    systemText.textContent = 'Connected';
});

socket.on('disconnect', () => {
    addLog('Disconnected from server', 'alert');
    updateStatus('systemStatus', '❌', 'systemText', false);
    systemText.textContent = 'Disconnected';
});

socket.on('bluetooth-status', (data) => {
    if (data.connected) {
        addLog(`Bluetooth connected: ${data.port}`, 'success');
        updateStatus('bluetoothStatus', '📡', 'bluetoothText', true);
        bluetoothText.textContent = 'Connected';
    } else {
        addLog('Bluetooth disconnected', 'alert');
        updateStatus('bluetoothStatus', '📡', 'bluetoothText', false);
        bluetoothText.textContent = data.error || 'Disconnected';
    }
});

socket.on('arduino-trigger', (data) => {
    addLog(`🚨 FSR Sensor triggered! Value: ${data.value}`, 'alert');
    updateStatus('arduinoStatus', '🔴', 'arduinoText', true);
    arduinoText.textContent = `Triggered: ${data.value}`;
    
    showEmergencyPopup();
});

// Show emergency popup
function showEmergencyPopup() {
    currentAlertTimestamp = new Date().toISOString();
    popupOverlay.classList.add('show');
    timeLeft = 60;
    startCountdown();
    addLog('Emergency popup displayed - 60 second countdown started', 'alert');
}

// Start countdown
function startCountdown() {
    countdown.textContent = timeLeft;
    
    countdownInterval = setInterval(() => {
        timeLeft--;
        countdown.textContent = timeLeft;
        
        if (timeLeft <= 10) {
            countdown.style.color = '#dc3545';
            countdown.style.fontSize = '4rem';
        }
        
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            addLog('⏰ TIMEOUT - No response received', 'alert');
            sendEmergencyResponse('YES'); // Auto-trigger emergency
        }
    }, 1000);
}

// Send emergency response
function sendEmergencyResponse(response) {
    clearInterval(countdownInterval);
    popupOverlay.classList.remove('show');
    
    if (response === 'YES') {
        addLog('🚨 EMERGENCY CONFIRMED - Sending alert to Hospital (Site 2)', 'alert');
        
        fetch('/api/emergency', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                response: 'YES',
                timestamp: currentAlertTimestamp
            })
        });
        
        updateStatus('arduinoStatus', '🚨', 'arduinoText', true);
        arduinoText.textContent = 'Emergency Active';
        
    } else {
        addLog('✅ False alarm - Emergency cancelled', 'success');
        updateStatus('arduinoStatus', '🔌', 'arduinoText', false);
        arduinoText.textContent = 'Waiting for signal';
        
        fetch('/api/emergency', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                response: 'NO',
                timestamp: currentAlertTimestamp
            })
        });
    }
    
    // Reset countdown display
    countdown.style.color = '#dc3545';
    countdown.style.fontSize = '3rem';
}

// Event Listeners
yesBtn.addEventListener('click', () => {
    addLog('User clicked YES - Accident confirmed', 'alert');
    sendEmergencyResponse('YES');
});

noBtn.addEventListener('click', () => {
    addLog('User clicked NO - False alarm', 'success');
    sendEmergencyResponse('NO');
});

testBtn.addEventListener('click', () => {
    addLog('🧪 Test trigger initiated', 'info');
    socket.emit('test-trigger');
});

// Keyboard shortcuts
document.addEventListener('keydown', (event) => {
    if (popupOverlay.classList.contains('show')) {
        if (event.key === 'y' || event.key === 'Y') {
            addLog('User pressed Y key - Accident confirmed', 'alert');
            sendEmergencyResponse('YES');
        } else if (event.key === 'n' || event.key === 'N') {
            addLog('User pressed N key - False alarm', 'success');
            sendEmergencyResponse('NO');
        }
    }
});

// Initialize
addLog('System initialized', 'success');
addLog('Waiting for Arduino FSR trigger via HC-05 Bluetooth...', 'info');