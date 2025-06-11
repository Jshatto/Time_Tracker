const { fetch } = window;

(async () => {
  const { fetchTimerState, startTimer, stopTimer } = await import('../../shared/api.js');

  const statusEl = document.getElementById('status');
  const timerDisplayEl = document.getElementById('timerDisplay');
  const timerStatusEl = document.getElementById('timerStatus');
  const controlsEl = document.getElementById('controls');

  // Create buttons
  const startBtn = document.createElement('button');
  startBtn.className = 'btn btn-success';
  startBtn.textContent = 'Start Timer';
  startBtn.id = 'startBtn';

  const stopBtn = document.createElement('button');
  stopBtn.className = 'btn btn-danger';
  stopBtn.textContent = 'Stop Timer';
  stopBtn.id = 'stopBtn';
  stopBtn.disabled = true;

  controlsEl.appendChild(startBtn);
  controlsEl.appendChild(stopBtn);

  let timerInterval;
  let startTime;

  function updateTimerDisplay() {
    if (startTime) {
      const elapsed = Date.now() - startTime;
      const hours = Math.floor(elapsed / 3600000);
      const minutes = Math.floor((elapsed % 3600000) / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      
      const display = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      timerDisplayEl.textContent = display;
    }
  }

  async function refresh() {
    try {
      const state = await fetchTimerState();
      
      if (state.running) {
        startTime = new Date(state.startTime).getTime();
        statusEl.textContent = `Running since ${new Date(state.startTime).toLocaleTimeString()}`;
        timerStatusEl.textContent = 'Timer Running';
        timerStatusEl.className = 'timer-status running';
        timerDisplayEl.className = 'timer-time running';
        startBtn.disabled = true;
        stopBtn.disabled = false;
        
        if (!timerInterval) {
          timerInterval = setInterval(updateTimerDisplay, 1000);
        }
        updateTimerDisplay();
      } else {
        startTime = null;
        statusEl.textContent = 'Timer stopped';
        timerStatusEl.textContent = 'Ready to start';
        timerStatusEl.className = 'timer-status stopped';
        timerDisplayEl.className = 'timer-time';
        timerDisplayEl.textContent = '00:00:00';
        startBtn.disabled = false;
        stopBtn.disabled = true;
        
        if (timerInterval) {
          clearInterval(timerInterval);
          timerInterval = null;
        }
      }
    } catch (err) {
      statusEl.textContent = 'Error connecting to server';
      statusEl.className = 'status-text error-message';
      console.error('Error fetching timer state:', err);
    }
  }

  startBtn.addEventListener('click', async () => {
    try {
      startBtn.disabled = true;
      await startTimer();
      await refresh();
    } catch (err) {
      console.error('Error starting timer:', err);
      statusEl.textContent = 'Error starting timer';
      statusEl.className = 'status-text error-message';
      startBtn.disabled = false;
    }
  });

  stopBtn.addEventListener('click', async () => {
    try {
      stopBtn.disabled = true;
      await stopTimer();
      await refresh();
    } catch (err) {
      console.error('Error stopping timer:', err);
      statusEl.textContent = 'Error stopping timer';
      statusEl.className = 'status-text error-message';
      stopBtn.disabled = false;
    }
  });

  // Initial load and set up periodic refresh
  setInterval(refresh, 3000);
  refresh();
})();