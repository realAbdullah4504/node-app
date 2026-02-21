import Redis from "ioredis";

const subscriber = new Redis({
  host: "redis-18619.c283.us-east-1-4.ec2.cloud.redislabs.com",
  port: 18619,
  password: "vfGsq0AJ84EjYk4hGFpHYimF6LE6YUvG",
});

const CHANNEL = "jobs";

subscriber.subscribe(CHANNEL, () => {
  console.log(`📡 Subscribed to ${CHANNEL}`);
});

subscriber.on("message", (channel, message) => {
  const data = JSON.parse(message);

  console.log("📥 Received message:");
  console.log("Channel:", channel);
  console.log("Data:", data);

  // Simulate processing
  setTimeout(() => {
    console.log("✅ Job processed\n");
  }, 1000);
});