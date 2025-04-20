const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Enable CORS for frontend server (3000)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// 🔍 Log incoming request headers
app.use((req, res, next) => {
  console.log('🛎️ INCOMING REQUEST');
  console.log('➡️ URL:', req.originalUrl);
  console.log('➡️ Method:', req.method);
  console.log('➡️ Headers:', req.headers);
  console.log('-------------------------------');
  next();
});

// Serve static frontend
// app.use(express.static(path.join(__dirname, 'public')));

// API endpoint
app.post('/api/hello', (req, res) => {
  res.json({ message: '✅ Hello from backend (4000)',headers:req.headers });
});

// Start server
app.listen(4000, () => {
  console.log('🔧 Backend running on http://localhost:4000');
});
