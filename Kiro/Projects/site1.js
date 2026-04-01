// Site 1 - Emergency Detection System
console.log('=== SITE 1: Emergency Detection System Started ===');

// Clear any previous emergency on page load
localStorage.removeItem('emergencyActive');
localStorage.removeItem('emergencyTime');
console.log('Previous emergency data cleared');

// Get elements
const questionPopup = document.getElementById('question-popup');
const emergencyTriggered = document.getElementById('emergency-triggered');
const yesButton = document.getElementById('yes-button');
const noButton = document.getElementById('no-button');
const closeEmergencyBtn = document.getElementById('close-emergency');
const countdownElement = document.getElementById('countdown');
const timerText = document.getElementById('timer-text');
const statusText = document.getElementById('status-text');

// Timer variables
let timeLeft = 60;
let timerInterval;

// Hide popup initially
questionPopup.style.display = 'none';

// Show popup after 10 seconds delay
console.log('Waiting 10 seconds before showing popup...');
timerText.textContent = 'System ready';
statusText.textContent = 'Monitoring system active';

setTimeout(() => {
    questionPopup.style.display = 'flex';
    console.log('Emergency question popup displayed');
    startCountdown();
}, 10000); // 10 seconds delay

function startCountdown() {
    console.log('Countdown started: 60 seconds');
    timerText.textContent = `Timer running: ${timeLeft} seconds remaining`;
    statusText.textContent = 'Waiting for response...';
    
    timerInterval = setInterval(() => {
        timeLeft--;
        countdownElement.textContent = timeLeft;
        timerText.textContent = `Timer running: ${timeLeft} seconds remaining`;
        
        // Change color when time is low
        if (timeLeft <= 10) {
            countdownElement.style.color = '#d32f2f';
            countdownElement.style.fontSize = '2em';
        }
        
        // Timer expired - trigger emergency
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            console.log('⏰ TIMER EXPIRED - No response received');
            triggerEmergency('Timer expired - No response');
        }
    }, 1000);
}

function triggerEmergency(reason) {
    console.log('🚨 TRIGGERING EMERGENCY 🚨');
    console.log('Reason:', reason);
    
    // Hide popup
    questionPopup.style.display = 'none';
    
    // Show emergency screen
    emergencyTriggered.classList.add('show');
    
    // Update status
    timerText.textContent = 'Emergency activated!';
    statusText.textContent = reason;
    statusText.style.color = '#d32f2f';
    
    // Set localStorage to notify Site 2
    const now = new Date();
    localStorage.setItem('emergencyActive', 'true');
    localStorage.setItem('emergencyTime', now.toISOString());
    localStorage.setItem('emergencyReason', reason);
    
    console.log('✅ localStorage updated:');
    console.log('  emergencyActive:', localStorage.getItem('emergencyActive'));
    console.log('  emergencyTime:', localStorage.getItem('emergencyTime'));
    console.log('  emergencyReason:', localStorage.getItem('emergencyReason'));
    console.log('');
    console.log('🔔 Site 2 should now show the emergency alert!');
    console.log('   Open site2.html to see the alert.');
}

function cancelEmergency() {
    console.log('✅ Emergency cancelled by user');
    clearInterval(timerInterval);
    
    // Hide popup
    questionPopup.style.display = 'none';
    
    // Update status
    timerText.textContent = 'Timer stopped';
    statusText.textContent = 'User reported no emergency - System ready';
    statusText.style.color = '#4caf50';
    
    // Clear localStorage
    localStorage.removeItem('emergencyActive');
    localStorage.removeItem('emergencyTime');
    localStorage.removeItem('emergencyReason');
    
    console.log('localStorage cleared');
}

// Event Listeners
yesButton.addEventListener('click', () => {
    clearInterval(timerInterval);
    console.log('👤 User clicked YES button');
    triggerEmergency('User requested emergency assistance');
});

noButton.addEventListener('click', () => {
    cancelEmergency();
});

closeEmergencyBtn.addEventListener('click', () => {
    emergencyTriggered.classList.remove('show');
    console.log('Emergency screen closed');
});

// Keyboard shortcuts
document.addEventListener('keydown', (event) => {
    if (questionPopup.style.display === 'flex') {
        if (event.key === 'y' || event.key === 'Y') {
            clearInterval(timerInterval);
            console.log('👤 User pressed Y key');
            triggerEmergency('User pressed Y key for emergency');
        } else if (event.key === 'n' || event.key === 'N') {
            console.log('👤 User pressed N key');
            cancelEmergency();
        }
    }
});

console.log('Site 1 initialized successfully');
console.log('User has 60 seconds to respond to the emergency question');
