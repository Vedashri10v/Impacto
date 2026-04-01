# How to Test the Emergency Alert System

## Step-by-Step Testing Instructions

### Step 1: Open Website 2 First
1. Open `website2.html` in your browser
2. You should see: "🔍 Looking for Emergency Alerts..."
3. Open the browser console (F12) to see debug messages
4. You should see: "Website 2: Emergency Alert Monitor Started"
5. Leave this tab open

### Step 2: Open Website 1 in Another Tab
1. Open `index.html` in a NEW TAB (same browser window)
2. You should see a red popup asking about accident
3. You have 60 seconds to respond

### Step 3: Trigger Emergency
1. Click the "YES, I NEED HELP" button on Website 1
2. Check the console - you should see localStorage being set
3. Switch back to Website 2 tab
4. You should now see the full-screen red emergency alert!

### Step 4: Reset and Test Again
1. Refresh Website 1 (`index.html`)
2. This clears the emergency
3. Website 2 should go back to "Looking for alerts..."
4. Click YES again to test

## Troubleshooting

### If Website 2 doesn't show the alert:

1. **Check Console Logs:**
   - Open F12 console on both tabs
   - Website 1 should show: "localStorage.emergencyActive = true"
   - Website 2 should show: "Checking... emergencyActive: true"

2. **Check localStorage:**
   - In console, type: `localStorage.getItem('emergencyActive')`
   - Should return: "true" after clicking YES

3. **Same Origin:**
   - Both files must be opened from the same location
   - Use `file:///` or run the server: `node serve.js`

4. **Browser Support:**
   - Make sure localStorage is enabled in your browser
   - Try a different browser (Chrome, Firefox, Edge)

## Expected Behavior

✅ Website 2 shows "Looking for alerts..." when first opened
✅ Website 1 shows popup with 1-minute timer
✅ Clicking YES on Website 1 sets localStorage
✅ Website 2 detects the change within 500ms
✅ Website 2 shows full-screen emergency alert
✅ Refreshing Website 1 clears the emergency

## Console Commands for Manual Testing

Open console (F12) and try these:

```javascript
// Manually trigger emergency (test Website 2)
localStorage.setItem('emergencyActive', 'true');
localStorage.setItem('emergencyTime', new Date().toISOString());

// Clear emergency
localStorage.removeItem('emergencyActive');
localStorage.removeItem('emergencyTime');

// Check current status
console.log('Emergency Active:', localStorage.getItem('emergencyActive'));
```