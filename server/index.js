// server/index.js
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
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

const projectRoutes = require('./routes/projects');
const clientRoutes = require('./routes/clients');

app.use('/projects', projectRoutes);
app.use('/clients', clientRoutes);

app.use(express.json());
app.use('/api/logs', require('./routes/logs'));

app.use('/api/timer', require('./routes/timer'));
function startServer() {
  
}

if (require.main === module) {
  mongoose
    .connect(MONGO_URI, {
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
}

module.exports = app;