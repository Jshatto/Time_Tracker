require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

const projectRoutes = require('./routes/projects');
const clientRoutes = require('./routes/clients');

app.use('/projects', projectRoutes);
app.use('/clients', clientRoutes);

app.use(express.json());
app.use('/api/logs', require('./routes/logs'));

app.use('/api/timer', require('./routes/timer'));

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
});