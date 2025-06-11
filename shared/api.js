// Get API base URL from environment or default to localhost
const getApiBase = () => {
  // For Vite (React dashboard)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.VITE_API_URL || 'http://localhost:5000';
  }
  // For Node.js/Electron (desktop app)
  if (typeof process !== 'undefined' && process.env) {
    return process.env.API_URL || 'http://localhost:5000';
  }
  // Fallback
  return 'http://localhost:5000';
};

const API_BASE = getApiBase();

/**
 * Fetch the current timer state
 * @returns {Promise<{running: boolean, startTime: string|null}>}
 */
export const fetchTimerState = async () => {
  const response = await fetch(`${API_BASE}/api/timer/state`);
  if (!response.ok) {
    throw new Error(`Failed to fetch timer state: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

/**
 * Start the timer
 * @param {Object} options - Timer options
 * @param {string} options.project - Project name (optional)
 * @param {string} options.description - Description (optional)
 * @returns {Promise<Object>}
 */
export const startTimer = async (options = {}) => {
  const response = await fetch(`${API_BASE}/api/timer/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      project: options.project || '',
      description: options.description || '',
      userId: options.userId || 'default-user'
    })
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || 'Failed to start timer');
  }
  
  return response.json();
};

/**
 * Stop the timer
 * @param {Object} options - Stop options
 * @returns {Promise<Object>}
 */
export const stopTimer = async (options = {}) => {
  const response = await fetch(`${API_BASE}/api/timer/stop`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: options.userId || 'default-user'
    })
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || 'Failed to stop timer');
  }
  
  return response.json();
};

/**
 * Fetch timer logs/entries
 * @param {Object} options - Query options
 * @returns {Promise<Array>}
 */
export const fetchLogs = async (options = {}) => {
  const params = new URLSearchParams();
  if (options.limit) params.set('limit', options.limit);
  if (options.offset) params.set('offset', options.offset);
  if (options.userId) params.set('userId', options.userId);
  
  const queryString = params.toString();
  const url = `${API_BASE}/api/logs${queryString ? '?' + queryString : ''}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch logs: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

/**
 * Create a new log entry
 * @param {Object} logData - Log entry data
 * @returns {Promise<Object>}
 */
export const createLog = async (logData) => {
  const response = await fetch(`${API_BASE}/api/logs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(logData)
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || 'Failed to create log entry');
  }
  
  return response.json();
};

/**
 * Fetch summary/statistics
 * @param {Object} options - Query options
 * @returns {Promise<Array>}
 */
export const fetchSummary = async (options = {}) => {
  const params = new URLSearchParams();
  if (options.period) params.set('period', options.period);
  if (options.userId) params.set('userId', options.userId);
  
  const queryString = params.toString();
  const url = `${API_BASE}/api/logs/summary${queryString ? '?' + queryString : ''}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch summary: ${response.status} ${response.statusText}`);
  }
  return response.json();
};