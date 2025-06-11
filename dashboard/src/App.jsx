import React, { useEffect, useState } from 'react';
import { fetchTimerState } from '../../shared/api.js';

function App() {
  const [state, setState] = useState({ running: false, startTime: null });

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchTimerState();
        setState(data);
      } catch (e) {
        console.error(e);
      }
    }
    load();
    const id = setInterval(load, 3000);
    return () => clearInterval(id);
  }, []);

  const [form, setForm] = useState({
    project: '',
    startTime: '',
    endTime: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        alert('Log saved!');
        setForm({ project: '', startTime: '', endTime: '', description: '' });
      } else {
        alert('Error saving log');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving log');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Welcome to the Time Tracker Dashboard</h1>
       <p>Status: {state.running ? `Running since ${new Date(state.startTime).toLocaleTimeString()}` : 'Stopped'}</p>
             <form
        onSubmit={handleSubmit}
        style={{
          marginTop: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          maxWidth: '400px'
        }}
      >
        <input
          name="project"
          placeholder="Project"
          value={form.project}
          onChange={handleChange}
          required
        />
        <input
          type="datetime-local"
          name="startTime"
          value={form.startTime}
          onChange={handleChange}
          required
        />
        <input
          type="datetime-local"
          name="endTime"
          value={form.endTime}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <button type="submit">Add Log</button>
      </form>
    </div>
  );
}

export default App;