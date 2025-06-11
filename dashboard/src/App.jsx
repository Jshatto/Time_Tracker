import React, { useEffect, useState, useCallback } from 'react';
import { fetchTimerState, createLog } from '../../shared/api.js';

function App() {
  const [state, setState] = useState({ running: false, startTime: null, error: null });
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchTimerState();
        setState(data);
      } catch (e) {
        console.error('Failed to load timer state:', e);
        setState({ running: false, startTime: null, error: 'Failed to connect to server' });
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

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError('');
  }, [formError]);

  const validateForm = useCallback(() => {
    if (!form.project.trim()) return 'Project name is required';
    if (!form.startTime) return 'Start time is required';
    if (!form.endTime) return 'End time is required';
    if (new Date(form.endTime) <= new Date(form.startTime)) 
      return 'End time must be after start time';
    return null;
  }, [form]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }
    
    setIsLoading(true);
    setFormError('');
    
    try {
      await createLog(form);
      alert('Log saved!');
      setForm({ project: '', startTime: '', endTime: '', description: '' });
    } catch (err) {
      console.error(err);
      setFormError(err.message || 'Error saving log');
    } finally {
      setIsLoading(false);
    }
  }, [form, validateForm]);

  return (
    <div className="container">
      <div className="header">
        <h1>Time Tracker Dashboard</h1>
        <p>Professional time tracking reimagined</p>
      </div>

      <div className="glass-card">
        <div className="timer-section">
          {state.error && (
            <div className="error-message">
              {state.error}
            </div>
          )}
          
          <p className="status-text">
            Status: {state.running 
              ? `Running since ${new Date(state.startTime).toLocaleTimeString()}` 
              : 'Stopped'
            }
          </p>
          
          <form onSubmit={handleSubmit} className="form-section">
            {formError && (
              <div className="error-message">
                {formError}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="project">Project</label>
              <input
                id="project"
                name="project"
                placeholder="Project name"
                value={form.project}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="startTime">Start Time</label>
              <input
                id="startTime"
                type="datetime-local"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="endTime">End Time</label>
              <input
                id="endTime"
                type="datetime-local"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Description (optional)"
                value={form.description}
                onChange={handleChange}
                disabled={isLoading}
                rows="3"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="btn btn-primary"
              aria-label="Add time log entry"
            >
              {isLoading ? 'Saving...' : 'Add Log'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;