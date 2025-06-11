const express = require('express');
const router = express.Router();
const Log = require('../models/Log');

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

router.get('/:userId', async (req, res) => {
  try {
    const logs = await Log.find({ userId: req.params.userId });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

module.exports = router;
