import Redis from "ioredis";

const redis = new Redis({
  host: "redis-18619.c283.us-east-1-4.ec2.cloud.redislabs.com",
  port: 18619,
  password: "vfGsq0AJ84EjYk4hGFpHYimF6LE6YUvG",
});

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err);
});

export default redis;