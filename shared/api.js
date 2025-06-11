const API_URL = 'http://localhost:5000'; // default server port

export async function fetchTimerState() {
  const res = await fetch(`${API_URL}/timer`);
  if (!res.ok) throw new Error('Failed to fetch timer state');
  return res.json();
}

export async function startTimer() {
  const res = await fetch(`${API_URL}/timer/start`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to start timer');
  return res.json();
}

export async function stopTimer() {
  const res = await fetch(`${API_URL}/timer/stop`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to stop timer');
  return res.json();
}