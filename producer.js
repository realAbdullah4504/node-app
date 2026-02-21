import express from "express";
import redis from "./redisClient.js";

const app = express();
app.use(express.json());

const CHANNEL = "jobs";

app.post("/publish", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message required" });
  }

  await redis.publish(CHANNEL, JSON.stringify({ message }));

  res.json({
    status: "Message published",
    channel: CHANNEL,
    message,
  });
});

app.listen(3000, () => {
  console.log("🚀 Publisher running on http://localhost:3000");
});