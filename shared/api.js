export async function fetchTimerState() {
  const res = await fetch('http://localhost:5000/timer');
  if (!res.ok) throw new Error('Failed to fetch timer state');
  return res.json();
}

export async function startTimer() {
  const res = await fetch('http://localhost:5000/timer/start', { method: 'POST' });
  if (!res.ok) throw new Error('Failed to start timer');
  return res.json();
}

export async function stopTimer() {
  const res = await fetch('http://localhost:5000/timer/stop', { method: 'POST' });
  if (!res.ok) throw new Error('Failed to stop timer');
  return res.json();
}