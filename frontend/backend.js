const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = {
  origin: 'http://localhost:3000', // React app URL
  credentials: true, // Allow credentials (cookies) to be sent
};

app.use(cors(corsOptions));

// Use cookie parser middleware
app.use(cookieParser());

// Set a session cookie with SameSite attribute
app.get('/set-cookie', (req, res) => {
  res.cookie('sessionId', '123456', { 
    httpOnly: true, 
    secure: true,  // Make sure to use HTTPS for secure cookies
    sameSite: 'None'  // Change this to 'Lax' or 'None' for different behaviors
  });
  console.log('Request headers:', req.headers);
  res.send('Cookie has been set with SameSite=Strict');
});

app.get('/', (req, res) => {
  console.log('Request headers:', req.headers);
  res.sendFile(path.join(__dirname, '/public/index.html'));
});
// A protected endpoint that requires the cookie
app.get('/secure-endpoint', (req, res) => {
  console.log('Request headers:', req.headers);
  if (req.cookies.sessionId) {
    res.json({ message: 'This is a secure endpoint', sessionId: req.cookies.sessionId,headers: req.headers });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

app.listen(4000, () => {
  console.log('Backend running on http://localhost:4000');
});
