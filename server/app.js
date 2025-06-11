// server/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static('public'));

// Root route - API information
app.get('/', (req, res) => {
  res.json({
    name: 'Time Tracker API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      timer: {
        start: 'POST /api/timer/start',
        stop: 'POST /api/timer/stop',
        status: 'GET /timer'
      },
      projects: {
        list: 'GET /projects',
        create: 'POST /projects',
        get: 'GET /projects/:id',
        update: 'PUT /projects/:id',
        delete: 'DELETE /projects/:id'
      },
      clients: {
        list: 'GET /clients',
        create: 'POST /clients',
        get: 'GET /clients/:id',
        update: 'PUT /clients/:id',
        delete: 'DELETE /clients/:id'
      },
      logs: {
        create: 'POST /api/logs',
        getByUser: 'GET /api/logs/:userId',
        summary: 'GET /api/logs/summary'
      }
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Simple timer state (in-memory)
let timerState = { running: false, startTime: null };

app.get('/timer', (req, res) => {
  res.json(timerState);
});

app.post('/timer/start', (req, res) => {
  timerState.running = true;
  timerState.startTime = Date.now();
  res.json(timerState);
});

app.post('/timer/stop', (req, res) => {
  timerState.running = false;
  timerState.startTime = null;
  res.json(timerState);
});

// API Routes
const projectRoutes = require('./routes/projects');
const clientRoutes = require('./routes/clients');
const logRoutes = require('./routes/logs');
const timerRoutes = require('./routes/timer');

app.use('/projects', projectRoutes);
app.use('/clients', clientRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/timer', timerRoutes);

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableRoutes: [
      'GET /',
      'GET /health',
      'GET /timer',
      'POST /timer/start',
      'POST /timer/stop',
      'GET /projects',
      'GET /clients',
      'GET /api/logs/summary',
      'POST /api/timer/start',
      'POST /api/timer/stop'
    ]
  });
});

module.exports = app;