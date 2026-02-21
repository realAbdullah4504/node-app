import express from "express";
import redis from "./redisClient.js";

const app = express();
app.use(express.json());

// Middleware to check cache
const cacheMiddleware = async (req, res, next) => {
  const { key } = req.params;
  const cachedData = await redis.get(key);

  if (cachedData) {
    console.log("🔹 Cache hit");
    return res.json({ source: "cache", data: JSON.parse(cachedData) });
  }

  console.log("🔹 Cache miss");
  next();
};

// Example route: Get data
app.get("/data/:key", cacheMiddleware, async (req, res) => {
  const { key } = req.params;

  // Simulate DB or heavy computation
  const dataFromDB = { message: `Hello for key ${key}`, timestamp: Date.now() };

  // Cache it in Redis for 10 seconds
  await redis.set(key, JSON.stringify(dataFromDB), "EX", 10);

  res.json({ source: "db", data: dataFromDB });
});

// Example route: Delete key
app.delete("/data/:key", async (req, res) => {
  const { key } = req.params;
  await redis.del(key);
  res.json({ message: `Key ${key} deleted from Redis` });
});

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));