const express = require('express');
const { createClient } = require('redis');

const app = express();
app.use(express.json());

// Redis client setup
const client = createClient();

client.connect()
  .then(() => console.log('Connected to Redis'))
  .catch(console.error);

// API to save data in cache
app.post('/cache', async (req, res) => {
  const { key, value } = req.body;
  await client.set(key, JSON.stringify(value));
  res.send('Data cached!');
});

// API to get data from cache
app.get('/cache/:key', async (req, res) => {
  const key = req.params.key;
  const data = await client.get(key);

  if (data) {
    res.json(JSON.parse(data));
  } else {
    res.status(404).send('Key not found');
  }
});

app.get('/all-keys', async (req, res) => {
    const keys = await client.keys('*');
    const results = {};
  
    for (const key of keys) {
      const value = await client.get(key);
      results[key] = JSON.parse(value);
    }
  
    res.json(results);
  });
  

// API to delete data from cache
app.delete('/cache/:key', async (req, res) => {
  const key = req.params.key;
  await client.del(key);
  res.send('Key deleted');
});

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
