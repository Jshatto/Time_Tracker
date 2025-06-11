// server/index.js
require('dotenv').config(); // Add this if not present
const mongoose = require('mongoose');
const express = require('express');
const app = require('./app');

// Add default values and validation
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Validate required environment variables
if (!MONGO_URI) {
  console.error('❌ MONGO_URI environment variable is required');
  process.exit(1);
}

// Routes are already configured in app.js, no need to duplicate here

function startServer() {
  // Server startup logic can go here if needed
}

if (require.main === module) {
  mongoose
    .connect(MONGO_URI) // ✅ Remove deprecated options
    .then(() => {
      console.log('✅ MongoDB connected');
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err.message);
      process.exit(1); // Exit on connection failure
    });
}

module.exports = app;