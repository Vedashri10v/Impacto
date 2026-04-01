# Emergency Alert System - Complete Rewrite

A two-website emergency detection and monitoring system with one-way communication.

## 🎯 What This Does

- **Site 1** (`site1.html`): Asks if you need medical help with a 60-second timer
- **Site 2** (`site2.html`): Monitors for emergency alerts and displays them automatically

## 📁 Files

- `site1.html` - Emergency detection page (Website 1)
- `site2.html` - Emergency monitor page (Website 2)
- `site1.js` - JavaScript for Site 1
- `site2.js` - JavaScript for Site 2
- `styles.css` - All styling for both sites

## 🚀 How to Use

### Step 1: Open Site 2 First
1. Open `site2.html` in your browser
2. You'll see: "🔍 Monitoring for Alerts..." with a spinning loader
3. Keep this tab open

### Step 2: Open Site 1 in Another Tab
1. Open `site1.html` in a new tab (same browser)
2. A popup appears asking: "Did you encounter an accident?"
3. You have 60 seconds to respond

### Step 3: Trigger Emergency
Choose one:
- Click "YES - I NEED HELP" button
- Press Y key on keyboard
- Wait 60 seconds (timer expires)

### Step 4: Check Site 2
1. Switch back to the Site 2 tab
2. You'll see a full-screen red emergency alert!
3. Alert shows: "ACCIDENT DETECTED - HELP REQUIRED"

## 🔄 How It Works

1. **Site 1** sets data in browser localStorage when emergency is triggered
2. **Site 2** checks localStorage every 500ms for emergency signals
3. When Site 2 detects emergency = true, it shows the alert
4. No direct links between sites - they communicate via localStorage

## ✅ Features

### Site 1:
- 60-second countdown timer
- YES/NO buttons
- Keyboard shortcuts (Y/N keys)
- Auto-trigger on timer expiration
- Clears previous emergencies on page load

### Site 2:
- Real-time monitoring (checks every 500ms)
- Automatic alert display
- Shows emergency time
- Prevents page close/refresh during alert
- Returns to monitoring mode if emergency is cleared

## 🧪 Testing

### Quick Test:
1. Open `site2.html` → see "Monitoring for Alerts..."
2. Open `site1.html` → see popup with timer
3. Click YES → emergency triggered
4. Switch to Site 2 tab → see red alert screen

### Reset Test:
1. Refresh `site1.html` → clears emergency
2. Site 2 returns to monitoring mode
3. Test again

## 🐛 Troubleshooting

### Site 2 doesn't show alert?

1. **Check Console (F12)**
   - Site 1 should show: "✅ localStorage updated"
   - Site 2 should show: "🚨🚨🚨 EMERGENCY DETECTED!"

2. **Check localStorage**
   - Open console and type: `localStorage.getItem('emergencyActive')`
   - Should return: `"true"` after clicking YES

3. **Same Browser**
   - Both sites must be open in the same browser
   - localStorage is browser-specific

4. **Hard Refresh**
   - Press Ctrl+Shift+R (or Cmd+Shift+R on Mac)
   - Clears browser cache

### Manual Test:
Open console on Site 2 and run:
```javascript
localStorage.setItem('emergencyActive', 'true');
localStorage.setItem('emergencyTime', new Date().toISOString());
```
Alert should appear immediately!

## 🎨 Design Features

- Modern gradient backgrounds
- Smooth animations
- Responsive design (mobile-friendly)
- Clear visual hierarchy
- Pulsing indicators
- Color-coded states (red=emergency, green=ok, purple=monitoring)

## 📝 Notes

- Sites are completely independent (no links between them)
- Communication is one-way: Site 1 → Site 2
- Site 2 cannot trigger alerts, only display them
- Emergency alert on Site 2 cannot be closed by user
- Refreshing Site 1 clears the emergency state

## 🔧 Technical Details

- Pure HTML, CSS, JavaScript (no frameworks)
- Uses localStorage for cross-tab communication
- Polling interval: 500ms
- Timer duration: 60 seconds
- No server required (runs locally)

---

**Created:** Fresh rewrite with all new code, styles, and functionality
**Browser Support:** Chrome, Firefox, Edge, Safari (any modern browser with localStorage)