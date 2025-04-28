const express = require('express');
const app = express();

app.use(express.json());

app.post('/send-email', (req, res) => {
  const { to, subject, body } = req.body;
  console.log(`📧 Sending real email to ${to} with subject "${subject}"`);
  
  // Simulate delay of 2 seconds
  setTimeout(() => {
    console.log(`📨 Email sent to ${to}`);
    res.status(200).json({ message: 'Email sent successfully' });
  }, 2000);
});

app.listen(4000, () => {
  console.log('📧 Email service running on port 4000');
});
