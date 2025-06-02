// server.js
const express = require("express");
const cors = require("cors");
const { AccessToken, RoomServiceClient } = require("livekit-server-sdk");
const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

// Replace with your LiveKit credentials
const LIVEKIT_API_KEY = "APIDRWMt5mB3M3n";
const LIVEKIT_SECRET_KEY = "UMfibKeVLmLoRfEaqyCqWKII5GKAec2SyDDnXC4qqhbD";

app.get("/list-rooms", async (req, res) => {
  const roomService = new RoomServiceClient(
    "wss://streamin-app-1wvl2zft.livekit.cloud",
    LIVEKIT_API_KEY,
    LIVEKIT_SECRET_KEY
  );
  roomService
    .listRooms()
    .then((rooms) => {
      console.log("existing rooms", rooms);
      res.json({ rooms });
    })
    .catch((err) => {
      console.log(err);
    });
});
app.post("/get-token", async (req, res) => {
  req.headers.origin = "localhost:5173";
  const { identity, roomName } = req.body;

  if (!identity || !roomName) {
    return res.status(400).json({ error: "Missing identity or roomName" });
  }

  const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_SECRET_KEY, {
    identity,
    name: identity, // Optional: display name
  });

  // Add grants: allow user to join the room and publish/subscribe
  token.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
  });

  // Return signed JWT token
  const jwt = await token.toJwt();
  console.log(jwt);
  res.json({ token: jwt });
});

// Run server on port 3001
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`LiveKit token server running on http://localhost:${PORT}`);
});
