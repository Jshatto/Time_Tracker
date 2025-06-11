const mongoose = require('mongoose');

const TimeLogSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  duration: { type: Number } // duration in milliseconds
}, { timestamps: true });

module.exports = mongoose.model('TimeLog', TimeLogSchema);