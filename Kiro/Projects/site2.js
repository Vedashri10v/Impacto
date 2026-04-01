// Site 2 - Emergency Monitor
console.log('=== SITE 2: Emergency Monitor Started ===');

// Get elements
const waitingScreen = document.getElementById('waiting-screen');
const alertScreen = document.getElementById('alert-screen');
const monitorStatus = document.getElementById('monitor-status');
const alertTimeElement = document.getElementById('alert-time');

// Track if alert is already shown
let isAlertShown = false;

console.log('Monitoring system initialized');
console.log('Checking for emergency signals every 500ms...');

// Check for emergency status
function checkForEmergency() {
    const emergencyActive = localStorage.getItem('emergencyActive');
    const emergencyTime = localStorage.getItem('emergencyTime');
    const emergencyReason = localStorage.getItem('emergencyReason');
    
    // Log check (only every 10 seconds to avoid spam)
    if (Math.random() < 0.05) {
        console.log('Checking... emergencyActive:', emergencyActive);
    }
    
    if (emergencyActive === 'true' && !isAlertShown) {
        // EMERGENCY DETECTED!
        console.log('');
        console.log('🚨🚨🚨 EMERGENCY DETECTED! 🚨🚨🚨');
        console.log('Emergency Time:', emergencyTime);
        console.log('Emergency Reason:', emergencyReason);
        console.log('');
        
        showEmergencyAlert(emergencyTime, emergencyReason);
        
    } else if (emergencyActive !== 'true' && isAlertShown) {
        // Emergency was cleared
        console.log('Emergency cleared - returning to monitoring mode');
        hideEmergencyAlert();
    } else if (!isAlertShown) {
        // Update status with current time
        const now = new Date();
        monitorStatus.textContent = `Monitoring active (Last check: ${now.toLocaleTimeString()})`;
    }
}

function showEmergencyAlert(emergencyTime, reason) {
    isAlertShown = true;
    
    // Hide waiting screen
    waitingScreen.style.display = 'none';
    
    // Show alert screen
    alertScreen.classList.add('show');
    
    // Format time
    const time = new Date(emergencyTime);
    alertTimeElement.textContent = time.toLocaleString();
    
    console.log('✅ Emergency alert displayed on screen');
    console.log('Alert cannot be closed by user');
    
    // Prevent page close/refresh
    window.addEventListener('beforeunload', preventClose);
    
    // Prevent keyboard shortcuts
    document.addEventListener('keydown', preventKeyboard);
}

function hideEmergencyAlert() {
    isAlertShown = false;
    
    // Show waiting screen
    waitingScreen.style.display = 'flex';
    
    // Hide alert screen
    alertScreen.classList.remove('show');
    
    monitorStatus.textContent = 'Monitoring active - Waiting for emergency signals';
    
    // Remove event listeners
    window.removeEventListener('beforeunload', preventClose);
    document.removeEventListener('keydown', preventKeyboard);
}

function preventClose(event) {
    event.preventDefault();
    event.returnValue = '';
    return '🚨 Emergency alert is active!';
}

function preventKeyboard(event) {
    // Prevent F5, Ctrl+R, Ctrl+W, Escape
    if (event.key === 'F5' || 
        event.key === 'Escape' || 
        (event.ctrlKey && (event.key === 'r' || event.key === 'w' || event.key === 'R' || event.key === 'W'))) {
        event.preventDefault();
        console.log('⚠️ User tried to close/refresh - prevented');
        alert('🚨 EMERGENCY ALERT ACTIVE\nThis page cannot be closed or refreshed!');
    }
}

// Check immediately on load
checkForEmergency();

// Check every 500ms for updates
setInterval(checkForEmergency, 500);

// Also listen for storage events (works across tabs in same browser)
window.addEventListener('storage', (event) => {
    if (event.key === 'emergencyActive') {
        console.log('Storage event detected:', event.key, '=', event.newValue);
        checkForEmergency();
    }
});

console.log('Site 2 monitoring started successfully');
console.log('');
console.log('📋 INSTRUCTIONS:');
console.log('1. Keep this tab open');
console.log('2. Open site1.html in another tab');
console.log('3. Click YES or wait for timer to expire');
console.log('4. This page will automatically show the emergency alert');
console.log('');
