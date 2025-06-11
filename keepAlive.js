const https = require('https');

const URL = 'https://your-service-name.onrender.com';
const INTERVAL = 14 * 60 * 1000; // 14 minutes in milliseconds

function ping() {
  https
    .get(URL, res => {
      console.log(`[${new Date().toISOString()}] Ping status: ${res.statusCode}`);
      // Drain data so the connection closes properly
      res.on('data', () => {});
    })
    .on('error', err => {
      console.error(`[${new Date().toISOString()}] Ping failed:`, err.message);
    });
}

ping();
setInterval(ping, INTERVAL);