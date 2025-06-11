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
        $match: {
          endTime: { $exists: true } // Only completed time logs
        }
      },
      {
        $group: {
          _id: { 
            userId: '$userId', 
            project: '$project',
            client: '$client'
          },
          totalMs: { $sum: '$duration' },
          sessionCount: { $sum: 1 }
        },
      },
      {
        $lookup: {
          from: 'projects',
          localField: '_id.project',
          foreignField: '_id',
          as: 'projectInfo'
        }
      },
      {
        $lookup: {
          from: 'clients',
          localField: '_id.client',
          foreignField: '_id',
          as: 'clientInfo'
        }
      }
    ]);

    const summary = results.map((r) => {
      const base = {
        userId: r._id.userId,
        project: r.projectInfo[0] || null,
        client: r.clientInfo[0] || null,
        sessionCount: r.sessionCount
      };
      if (unit === 'hours') {
        return { ...base, hours: r.totalMs / 3600000 };
      }
      return { ...base, totalMs: r.totalMs };
    });

    res.json(summary);
  } catch (err) {
    console.error('Error fetching summary:', err);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

// GET /api/logs/detailed/:userId - Get detailed time logs for a user
router.get('/detailed/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate, project, client } = req.query;
    
    let query = { 
      userId, 
      endTime: { $exists: true } 
    };
    
    // Add date filters if provided
    if (startDate || endDate) {
      query.startTime = {};
      if (startDate) query.startTime.$gte = new Date(startDate);
      if (endDate) query.startTime.$lte = new Date(endDate);
    }
    
    // Add project filter if provided
    if (project) {
      query.project = project;
    }
    
    // Add client filter if provided
    if (client) {
      query.client = client;
    }
    
    const logs = await TimeLog.find(query)
      .populate(['project', 'client'])
      .sort({ startTime: -1 });
      
    res.json(logs);
  } catch (err) {
    console.error('Error fetching detailed logs:', err);
    res.status(500).json({ error: 'Failed to fetch detailed logs' });
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