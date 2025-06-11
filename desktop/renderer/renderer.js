const { fetch } = window;

(async () => {
  const { fetchTimerState, startTimer, stopTimer } = await import('../../shared/api.js');

  const statusEl = document.createElement('p');
  const button = document.createElement('button');
  document.body.appendChild(statusEl);
  document.body.appendChild(button);

  async function refresh() {
    try {
      const state = await fetchTimerState();
      statusEl.textContent = state.running
        ? `Running since ${new Date(state.startTime).toLocaleTimeString()}`
        : 'Stopped';
      button.textContent = state.running ? 'Stop' : 'Start';
    } catch (err) {
      statusEl.textContent = 'Error connecting to server';
    }
  }

  button.addEventListener('click', async () => {
    if (button.textContent === 'Start') {
      await startTimer();
    } else {
      await stopTimer();
    }
    refresh();
  });

  setInterval(refresh, 3000);
  refresh();
})();