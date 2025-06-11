const statusEl = document.getElementById('status');
const toggle = document.getElementById('toggle');

async function fetchState() {
  const res = await fetch('http://localhost:5000/timer');
  return res.json();
}

async function startTimer() {
  await fetch('http://localhost:5000/timer/start', { method: 'POST' });
}

async function stopTimer() {
  await fetch('http://localhost:5000/timer/stop', { method: 'POST' });
}

async function refresh() {
  try {
    const state = await fetchState();
    statusEl.textContent = state.running
      ? `Running since ${new Date(state.startTime).toLocaleTimeString()}`
      : 'Stopped';
    toggle.textContent = state.running ? 'Stop' : 'Start';
  } catch (err) {
    statusEl.textContent = 'Error';
  }
}

toggle.addEventListener('click', async () => {
  if (toggle.textContent === 'Start') {
    await startTimer();
  } else {
    await stopTimer();
  }
  refresh();
});

setInterval(refresh, 3000);
refresh();