// Configuration
const API_URLS = [
  'https://time-tracker-nust.onrender.com', // Production
  'http://localhost:5000', // Development  
  'http://localhost:3000'  // Alternative dev port
];

// DOM Elements
const statusEl = document.getElementById('status');
const toggleBtn = document.getElementById('toggleBtn');
const openDashboardBtn = document.getElementById('openDashboard');
const timerDisplayEl = document.getElementById('timerDisplay');
const statusBadgeEl = document.getElementById('statusBadge');
const errorMessageEl = document.getElementById('errorMessage');
const debugInfoEl = document.getElementById('debugInfo');
const clientSelectEl = document.getElementById('clientSelect');
const projectSelectEl = document.getElementById('projectSelect');

// State
let currentApiUrl = null;
let timerInterval = null;
let isRunning = false;
let startTime = null;
let clients = [];
let projects = [];

// Debug mode (set to true for troubleshooting)
const DEBUG_MODE = false;

// Utility Functions
function log(message, data = null) {
  console.log(`[Time Tracker Extension] ${message}`, data || '');
  if (DEBUG_MODE) {
    updateDebugInfo(message);
  }
}

function updateDebugInfo(message) {
  const timestamp = new Date().toLocaleTimeString();
  const debugText = debugInfoEl.textContent || '';
  debugInfoEl.textContent = `${timestamp}: ${message}\n${debugText}`.slice(0, 500);
  debugInfoEl.style.display = 'block';
}

function formatTime(milliseconds) {
  const hours = Math.floor(milliseconds / 3600000);
  const minutes = Math.floor((milliseconds % 3600000) / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateTimerDisplay() {
  if (isRunning && startTime) {
    const elapsed = Date.now() - startTime;
    timerDisplayEl.textContent = formatTime(elapsed);
    timerDisplayEl.className = 'timer-display running';
  } else {
    timerDisplayEl.textContent = '00:00:00';
    timerDisplayEl.className = 'timer-display';
  }
}

function showError(message) {
  errorMessageEl.textContent = message;
  errorMessageEl.style.display = 'block';
  log(`Error: ${message}`);
  setTimeout(() => {
    errorMessageEl.style.display = 'none';
  }, 10000);
}

function setLoading(loading) {
  toggleBtn.disabled = loading;
  if (loading) {
    document.querySelector('.popup-container').classList.add('loading');
  } else {
    document.querySelector('.popup-container').classList.remove('loading');
  }
}

// API Functions
async function findWorkingApiUrl() {
  if (currentApiUrl) {
    log(`Using cached API URL: ${currentApiUrl}`);
    return currentApiUrl;
  }
  
  log('Testing API connections...');
  
  for (const url of API_URLS) {
    try {
      log(`Testing: ${url}`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      // Test with the health endpoint first
      const response = await fetch(`${url}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        currentApiUrl = url;
        log(`✅ Connected successfully to: ${url}`);
        return url;
      } else {
        log(`❌ ${url} responded with status: ${response.status}`);
      }
    } catch (error) {
      log(`❌ ${url} failed: ${error.message}`);
    }
  }
  
  throw new Error('No API server available. Is your Time Tracker server running?');
}

async function fetchTimerState() {
  const apiUrl = await findWorkingApiUrl();
  
  // Use the correct endpoint: /api/timer/current/extension-user
  const response = await fetch(`${apiUrl}/api/timer/current/extension-user`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch timer state: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  log('Timer state fetched', data);
  
  // Transform the response to match what our UI expects
  if (data.active && data.timer) {
    return {
      running: true,
      startTime: data.timer.startTime,
      timer: data.timer
    };
  } else {
    return {
      running: false,
      startTime: null
    };
  }
}

async function fetchClients() {
  const apiUrl = await findWorkingApiUrl();
  try {
    const response = await fetch(`${apiUrl}/clients`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      const data = await response.json();
      log(`Fetched ${data.length} clients`);
      return data;
    } else {
      log(`Failed to fetch clients: ${response.status}`);
      return [];
    }
  } catch (error) {
    log(`Client fetch error: ${error.message}`);
    return [];
  }
}

async function fetchProjects() {
  const apiUrl = await findWorkingApiUrl();
  try {
    const response = await fetch(`${apiUrl}/projects`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      const data = await response.json();
      log(`Fetched ${data.length} projects`);
      return data;
    } else {
      log(`Failed to fetch projects: ${response.status}`);
      return [];
    }
  } catch (error) {
    log(`Project fetch error: ${error.message}`);
    return [];
  }
}

async function startTimer() {
  const apiUrl = await findWorkingApiUrl();
  const clientId = clientSelectEl.value;
  const projectId = projectSelectEl.value;
  
  const requestBody = {
    userId: 'extension-user',
    description: 'Started from browser extension'
  };
  
  if (clientId) requestBody.clientId = clientId;
  if (projectId) requestBody.projectId = projectId;
  
  log('Starting timer with:', requestBody);
  
  const response = await fetch(`${apiUrl}/api/timer/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `Failed to start timer: ${response.status}`);
  }
  
  const data = await response.json();
  log('Timer started successfully', data);
  return data;
}

async function stopTimer() {
  const apiUrl = await findWorkingApiUrl();
  
  const response = await fetch(`${apiUrl}/api/timer/stop`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: 'extension-user'
    })
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `Failed to stop timer: ${response.status}`);
  }
  
  const data = await response.json();
  log('Timer stopped successfully', data);
  return data;
}

// UI Update Functions
function updateClientsDropdown() {
  clientSelectEl.innerHTML = '<option value="">Select a client...</option>';
  clients.forEach(client => {
    const option = document.createElement('option');
    option.value = client._id || client.id;
    option.textContent = client.name;
    clientSelectEl.appendChild(option);
  });
}

function updateProjectsDropdown() {
  projectSelectEl.innerHTML = '<option value="">Select a project...</option>';
  projects.forEach(project => {
    const option = document.createElement('option');
    option.value = project._id || project.id;
    option.textContent = project.name;
    projectSelectEl.appendChild(option);
  });
}

function updateUI(state) {
  isRunning = state.running;
  
  if (state.running && state.startTime) {
    startTime = new Date(state.startTime).getTime();
    statusEl.textContent = `Running since ${new Date(state.startTime).toLocaleTimeString()}`;
    toggleBtn.textContent = 'Stop';
    toggleBtn.className = 'btn btn-danger';
    statusBadgeEl.textContent = 'Running';
    statusBadgeEl.className = 'status-badge running';
    
    if (!timerInterval) {
      timerInterval = setInterval(updateTimerDisplay, 1000);
    }
  } else {
    startTime = null;
    statusEl.textContent = 'Timer stopped';
    toggleBtn.textContent = 'Start';
    toggleBtn.className = 'btn btn-success';
    statusBadgeEl.textContent = 'Ready';
    statusBadgeEl.className = 'status-badge stopped';
    
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }
  
  updateTimerDisplay();
}

// Main Functions
async function loadInitialData() {
  try {
    log('Loading initial data...');
    
    // Load clients and projects in parallel
    const [clientsData, projectsData] = await Promise.all([
      fetchClients(),
      fetchProjects()
    ]);
    
    clients = clientsData;
    projects = projectsData;
    
    updateClientsDropdown();
    updateProjectsDropdown();
    
    log('Initial data loaded successfully');
  } catch (error) {
    log(`Failed to load initial data: ${error.message}`);
    showError('Failed to load clients/projects');
  }
}

async function refresh() {
  try {
    log('Refreshing timer state...');
    setLoading(true);
    
    const state = await fetchTimerState();
    updateUI(state);
    
    // Enable toggle button if we have a connection
    toggleBtn.disabled = false;
    
    // Clear any previous errors
    errorMessageEl.style.display = 'none';
    
    log('Timer state refreshed successfully');
    
  } catch (error) {
    log(`Refresh failed: ${error.message}`);
    
    // Update UI for error state
    statusEl.textContent = 'Connection error';
    statusBadgeEl.textContent = 'Error';
    statusBadgeEl.className = 'status-badge error';
    toggleBtn.disabled = true;
    
    // Reset timer
    isRunning = false;
    startTime = null;
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    updateTimerDisplay();
    
    showError(`Connection failed: ${error.message}`);
  } finally {
    setLoading(false);
  }
}

async function handleToggle() {
  try {
    setLoading(true);
    
    if (isRunning) {
      await stopTimer();
      statusEl.textContent = 'Stopping timer...';
    } else {
      await startTimer();
      statusEl.textContent = 'Starting timer...';
    }
    
    // Refresh state after action
    setTimeout(refresh, 1000);
    
  } catch (error) {
    log(`Toggle failed: ${error.message}`);
    showError(`Operation failed: ${error.message}`);
    setLoading(false);
  }
}

function openDashboard() {
  const url = currentApiUrl || 'https://time-tracker-nust.onrender.com';
  log(`Opening dashboard: ${url}`);
  chrome.tabs.create({ url: url });
}

// Event Listeners
toggleBtn.addEventListener('click', handleToggle);
openDashboardBtn.addEventListener('click', openDashboard);

// Project selection auto-selects client
projectSelectEl.addEventListener('change', function() {
  const selectedProject = projects.find(p => (p._id || p.id) === this.value);
  if (selectedProject && (selectedProject.clientId || selectedProject.client)) {
    const clientId = selectedProject.clientId || selectedProject.client._id || selectedProject.client;
    clientSelectEl.value = clientId;
  }
});

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  log('Extension popup loaded');
  
  // Load initial data and timer state
  await Promise.all([
    loadInitialData(),
    refresh()
  ]);
  
  // Set up periodic refresh
  setInterval(refresh, 10000); // Check every 10 seconds
});

// Handle visibility change to refresh when popup is opened
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    log('Popup became visible, refreshing...');
    refresh();
  }
});