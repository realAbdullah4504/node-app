const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors({ origin: true, credentials: true }));

app.get('/set-cookie', (req, res) => {
  res.cookie('sessionId', 'securetoken123', {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
  });
  res.setHeader('Set-Cookie', [
    `sessionId=securetoken123; Path=/; Domain=abdullah-javed.com; HttpOnly; Secure; SameSite=None`
  ]);  
  console.log('headers: ', req.headers);
  res.send('Cookie Set!');
});

app.listen(4001, () => console.log('Set-Cookie service running on port 4001'));
