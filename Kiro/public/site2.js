// Site 2 - Hospital Emergency Display
const socket = io();

// DOM Elements
const waitingScreen = document.getElementById('waitingScreen');
const alertScreen = document.getElementById('alertScreen');
const monitorStatus = document.getElementById('monitorStatus');
const alertTime = document.getElementById('alertTime');
const alertSound = document.getElementById('alertSound');

let isAlertActive = false;

console.log('🏥 Hospital Emergency Display - Site 2 Started');

// Socket.IO Events
socket.on('connect', () => {
    console.log('✅ Connected to server');
    updateMonitorStatus('Connected - Monitoring active');
});

socket.on('disconnect', () => {
    console.log('❌ Disconnected from server');
    updateMonitorStatus('Disconnected - Attempting to reconnect...');
});

socket.on('emergency-alert', (data) => {
    console.log('🚨🚨🚨 EMERGENCY ALERT RECEIVED! 🚨🚨🚨');
    console.log('Alert data:', data);
    showEmergencyAlert(data);
});

// Update monitor status
function updateMonitorStatus(status) {
    monitorStatus.textContent = status;
    const now = new Date().toLocaleTimeString();
    console.log(`[${now}] Status: ${status}`);
}

// Show emergency alert
function showEmergencyAlert(data) {
    if (isAlertActive) {
        console.log('Alert already active, ignoring duplicate');
        return;
    }
    
    isAlertActive = true;
    
    // Hide waiting screen
    waitingScreen.style.display = 'none';
    
    // Show alert screen
    alertScreen.classList.add('show');
    
    // Set alert time
    const time = new Date(data.timestamp);
    alertTime.textContent = time.toLocaleString();
    
    // Play alert sound
    alertSound.volume = 0.3;
    alertSound.play().catch(err => {
        console.log('Could not play alert sound:', err.message);
    });
    
    console.log('✅ Emergency alert displayed');
    console.log('🔊 Alert sound playing');
    
    // Prevent page close
    window.addEventListener('beforeunload', preventClose);
    
    // Prevent keyboard shortcuts
    document.addEventListener('keydown', preventKeyboard);
    
    // Flash the page title
    flashTitle();
}

// Hide emergency alert
function hideEmergencyAlert() {
    isAlertActive = false;
    
    // Show waiting screen
    waitingScreen.style.display = 'flex';
    
    // Hide alert screen
    alertScreen.classList.remove('show');
    
    // Stop alert sound
    alertSound.pause();
    alertSound.currentTime = 0;
    
    // Remove event listeners
    window.removeEventListener('beforeunload', preventClose);
    document.removeEventListener('keydown', preventKeyboard);
    
    // Stop title flashing
    clearInterval(titleFlashInterval);
    document.title = 'Hospital Emergency Display - Site 2';
    
    updateMonitorStatus('Monitoring active - Waiting for emergency signals');
    console.log('Alert cleared');
}

// Prevent page close
function preventClose(event) {
    event.preventDefault();
    event.returnValue = '🚨 Emergency alert is active!';
    return '🚨 Emergency alert is active!';
}

// Prevent keyboard shortcuts
function preventKeyboard(event) {
    if (event.key === 'F5' || 
        event.key === 'Escape' || 
        (event.ctrlKey && (event.key === 'r' || event.key === 'w' || 
                          event.key === 'R' || event.key === 'W'))) {
        event.preventDefault();
        console.log('⚠️ User tried to close/refresh - prevented');
        alert('🚨 EMERGENCY ALERT ACTIVE\nThis page cannot be closed!');
    }
}

// Flash page title
let titleFlashInterval;
function flashTitle() {
    let isOriginal = true;
    titleFlashInterval = setInterval(() => {
        document.title = isOriginal ? '🚨 EMERGENCY ALERT! 🚨' : 'Hospital Emergency Display';
        isOriginal = !isOriginal;
    }, 1000);
}

// Update status periodically
setInterval(() => {
    if (!isAlertActive) {
        const now = new Date().toLocaleTimeString();
        updateMonitorStatus(`Monitoring active (Last check: ${now})`);
    }
}, 5000);

// Initialize
console.log('System initialized');
console.log('Waiting for emergency alerts from Site 1...');
updateMonitorStatus('Monitoring active - Waiting for emergency signals');