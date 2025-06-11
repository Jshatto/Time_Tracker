const express = require('express');
const router = express.Router();

const TimeLog = require('../models/TimeLog');

// POST /api/timer/start
router.post('/start', async (req, res) => {
  try {
    const { userId, projectId, clientId, description } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    // Check if there's already an active timer for this user
    const activeTimer = await TimeLog.findOne({ userId, endTime: { $exists: false } });
    if (activeTimer) {
      return res.status(400).json({ message: 'Timer already running. Please stop the current timer first.' });
    }

    const log = new TimeLog({
      userId,
      project: projectId || null,
      client: clientId || null,
      description: description || '',
      startTime: new Date()
    });
    
    await log.save();
    
    // Populate project and client info for response
    await log.populate(['project', 'client']);
    
    res.status(201).json(log);
  } catch (err) {
    console.error('Error starting timer:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/timer/stop
router.post('/stop', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const log = await TimeLog.findOne({ userId, endTime: { $exists: false } })
      .sort({ startTime: -1 })
      .populate(['project', 'client']);
      
    if (!log) {
      return res.status(404).json({ message: 'Active timer not found' });
    }

    log.endTime = new Date();
    log.duration = log.endTime - log.startTime;
    await log.save();

    res.json(log);
  } catch (err) {
    console.error('Error stopping timer:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/timer/current/:userId - Get current active timer
router.get('/current/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const activeTimer = await TimeLog.findOne({ userId, endTime: { $exists: false } })
      .populate(['project', 'client']);
      
    if (!activeTimer) {
      return res.json({ active: false });
    }
    
    res.json({ active: true, timer: activeTimer });
  } catch (err) {
    console.error('Error getting current timer:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/timer/recent/:userId - Get recent time entries
router.get('/recent/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    
    const recentEntries = await TimeLog.find({ userId, endTime: { $exists: true } })
      .populate(['project', 'client'])
      .sort({ startTime: -1 })
      .limit(limit);
      
    res.json(recentEntries);
  } catch (err) {
    console.error('Error getting recent entries:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;