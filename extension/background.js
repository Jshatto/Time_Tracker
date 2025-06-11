// Time Tracker Extension Background Service Worker

// Configuration
const BADGE_COLORS = {
  running: '#10b981', // Green
  stopped: '#64748b', // Gray
  error: '#ef4444'    // Red
};

const API_URLS = [
  'https://time-tracker-nust.onrender.com',
  'http://localhost:5000',
  'http://localhost:3000'
];

// State
let timerState = {
  running: false,
  startTime: null,
  lastCheck: null
};

// Utility Functions
function setBadgeText(text) {
  try {
    chrome.action.setBadgeText({ text: text });
  } catch (error) {
    console.log('Badge text error:', error);
  }
}

function setBadgeColor(color) {
  try {
    chrome.action.setBadgeBackgroundColor({ color: color });
  } catch (error) {
    console.log('Badge color error:', error);
  }
}

function updateBadge(state) {
  if (state.running) {
    setBadgeText('ON');
    setBadgeColor(BADGE_COLORS.running);
  } else {
    setBadgeText('');
    setBadgeColor(BADGE_COLORS.stopped);
  }
}

function formatDuration(milliseconds) {
  const hours = Math.floor(milliseconds / 3600000);
  const minutes = Math.floor((milliseconds % 3600000) / 60000);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return '<1m';
  }
}

// Storage Functions
async function saveState(state) {
  try {
    await chrome.storage.local.set({ timerState: state });
  } catch (error) {
    console.error('Failed to save state:', error);
  }
}

async function loadState() {
  try {
    const result = await chrome.storage.local.get(['timerState']);
    return result.timerState || timerState;
  } catch (error) {
    console.error('Failed to load state:', error);
    return timerState;
  }
}

// API Functions
async function checkTimerStatus() {
  for (const apiUrl of API_URLS) {
    try {
      const response = await fetch(`${apiUrl}/api/timer/state`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const state = await response.json();
        timerState = {
          running: state.running,
          startTime: state.startTime,
          lastCheck: Date.now()
        };
        
        // Save state
        await saveState(timerState);
        
        // Update badge
        updateBadge(timerState);
        
        // Update title with duration if running
        if (state.running && state.startTime) {
          const duration = Date.now() - new Date(state.startTime).getTime();
          const durationText = formatDuration(duration);
          try {
            chrome.action.setTitle({ 
              title: `Time Tracker - Running (${durationText})` 
            });
          } catch (error) {
            console.log('Title update error:', error);
          }
        } else {
          try {
            chrome.action.setTitle({ title: 'Time Tracker' });
          } catch (error) {
            console.log('Title update error:', error);
          }
        }
        
        console.log('Timer status updated:', timerState);
        return;
      }
    } catch (error) {
      console.log(`Failed to connect to ${apiUrl}:`, error.message);
    }
  }
  
  // If all APIs fail, show error state
  setBadgeText('!');
  setBadgeColor(BADGE_COLORS.error);
  try {
    chrome.action.setTitle({ title: 'Time Tracker - Connection Error' });
  } catch (error) {
    console.log('Title update error:', error);
  }
}

// Notification Functions
function showNotification(title, message, type = 'basic') {
  try {
    chrome.notifications.create({
      type: type,
      iconUrl: 'icon.png',
      title: title,
      message: message
    });
  } catch (error) {
    console.log('Notification error:', error);
  }
}

// Event Listeners
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('Time Tracker Extension installed/updated');
  
  try {
    // Initialize state
    timerState = await loadState();
    updateBadge(timerState);
    
    // Set up context menu
    chrome.contextMenus.create({
      id: 'openTracker',
      title: 'Open Time Tracker Dashboard',
      contexts: ['action']
    });
    
    // Initial status check
    checkTimerStatus();
    
    if (details.reason === 'install') {
      showNotification(
        'Time Tracker Extension',
        'Extension installed! Click the icon to start tracking time.'
      );
    }
  } catch (error) {
    console.error('Installation error:', error);
  }
});

chrome.runtime.onStartup.addListener(async () => {
  console.log('Extension startup');
  
  try {
    // Load saved state
    timerState = await loadState();
    updateBadge(timerState);
    
    // Check current status
    checkTimerStatus();
  } catch (error) {
    console.error('Startup error:', error);
  }
});

// Context menu click handler
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'openTracker') {
    try {
      chrome.tabs.create({ url: 'https://time-tracker-nust.onrender.com' });
    } catch (error) {
      console.error('Tab creation error:', error);
    }
  }
});

// Message handling for popup communication
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    if (request.action === 'getState') {
      sendResponse(timerState);
    } else if (request.action === 'refreshState') {
      checkTimerStatus().then(() => {
        sendResponse(timerState);
      }).catch((error) => {
        console.error('Refresh state error:', error);
        sendResponse({ error: error.message });
      });
      return true; // Keep message channel open for async response
    }
  } catch (error) {
    console.error('Message handling error:', error);
    sendResponse({ error: error.message });
  }
});

// Periodic status check (every 2 minutes)
setInterval(() => {
  try {
    checkTimerStatus();
  } catch (error) {
    console.error('Periodic check error:', error);
  }
}, 2 * 60 * 1000);

// Error handling
self.addEventListener('error', (event) => {
  console.error('Extension error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault(); // Prevent the default handling
});

// Initialize on script load
try {
  console.log('Time Tracker Extension Background Script Loaded');
} catch (error) {
  console.error('Script initialization error:', error);
}