const express = require('express');
const router = express.Router();

const TimeLog = require('../models/TimeLog');

// POST /api/timer/start
router.post('/start', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const log = new TimeLog({
      userId,
      startTime: new Date()
    });
    await log.save();
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
      .sort({ startTime: -1 });
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

module.exports = router;