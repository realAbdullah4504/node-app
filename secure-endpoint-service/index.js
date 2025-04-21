const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());

app.get('/secure-endpoint', (req, res) => {
  console.log('Cookies: ', req.headers);
  const { sessionId } = req.cookies;
  if (sessionId === 'securetoken123') {
    res.json({ message: 'Access granted to secure endpoint.' });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

app.listen(4002, () => console.log('Secure-endpoint service running on port 4002'));
