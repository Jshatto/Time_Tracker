// server/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

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

// Routes
const projectRoutes = require('./routes/projects');
const clientRoutes = require('./routes/clients');
const logRoutes = require('./routes/logs');
const timerRoutes = require('./routes/timer');

app.use('/projects', projectRoutes);
app.use('/clients', clientRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/timer', timerRoutes);

module.exports = app;
