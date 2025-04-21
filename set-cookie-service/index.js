const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors({
  origin: "https://abdullah-javed.com",   // ❗ Must match the frontend domain
  credentials: true,                      // ❗ Allow cookies
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.get('/set-cookie', (req, res) => {
  res.cookie('sessionId', 'securetoken123', {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    domain: '.abdullah-javed.com', // notice the dot!
    path: '/'
  });
  console.log('headers: ', req.headers);
  res.send('Cookie Set!');
});

app.listen(4001, () => console.log('Set-Cookie service running on port 4001'));
