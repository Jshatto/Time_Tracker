const express = require('express');
const router = express.Router();
const Log = require('../models/Log');
const TimeLog = require('../models/TimeLog');

router.post('/', async (req, res) => {
  const { userId, message } = req.body;
  if (!userId || !message) {
    return res.status(400).json({ error: 'userId and message are required' });
  }
  try {
    const log = await Log.create({ userId, message });
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create log' });
  }
});

// GET /api/logs/summary
router.get('/summary', async (req, res) => {
  try {
    const unit = req.query.unit === 'hours' ? 'hours' : 'ms';
    const results = await TimeLog.aggregate([
      {
        $group: {
          _id: { userId: '$userId', project: '$project' },
          totalMs: { $sum: '$duration' },
        },
      },
    ]);

    const summary = results.map((r) => {
      const base = {
        userId: r._id.userId,
        project: r._id.project,
      };
      if (unit === 'hours') {
        return { ...base, hours: r.totalMs / 3600000 };
      }
      return { ...base, totalMs: r.totalMs };
    });

    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const logs = await Log.find({ userId: req.params.userId });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

module.exports = router;
