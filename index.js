import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

/**
 * In-memory user store
 * (For production: use Redis instead)
 */
let users = [];

/**
 * Helper: get socketId from userId
 */
const getUserSocketId = (userId) => {
  return users.find((u) => u.userId === userId)?.socketId;
};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // =========================
  // 1. Register user
  // =========================
  socket.on("addUser", (userId) => {
    if (!userId) return;

    const exists = users.find((u) => u.userId === userId);

    if (!exists) {
      users.push({
        userId,
        socketId: socket.id,
      });
    } else {
      // update socketId if user reconnects
      exists.socketId = socket.id;
    }

    io.emit("getUsers", users);
  });

  // =========================
  // 2. Chat Message (direct user-to-user)
  // =========================
  socket.on("sendMessage", (data) => {
    /**
     * expected:
     * {
     *   senderId,
     *   receiverId,
     *   message
     * }
     */

    const receiverSocketId = getUserSocketId(data.receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("getMessage", {
        senderId: data.senderId,
        receiverId: data.receiverId,
        message: data.message,
        createdAt: new Date(),
      });
    }
  });

  // =========================
  // 3. Offer event (job/handyman app)
  // =========================
  socket.on("sendOffer", (data) => {
    /**
     * expected:
     * {
     *   receiverId,
     *   offer
     * }
     */

    const receiverSocketId = getUserSocketId(data.receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("getOffer", {
        offer: data.offer,
        createdAt: new Date(),
      });
    }
  });

  // =========================
  // 4. Review event
  // =========================
  socket.on("sendReview", (data) => {
    /**
     * expected:
     * {
     *   receiverId,
     *   review
     * }
     */

    const receiverSocketId = getUserSocketId(data.receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("getReview", {
        review: data.review,
        createdAt: new Date(),
      });
    }
  });

  // =========================
  // 5. Public events (broadcast)
  // =========================
  socket.on("publicEvent", (data) => {
    /**
     * example:
     * new job post, system update, etc.
     */

    io.emit("getPublicEvent", {
      type: data.type,
      payload: data.payload,
      createdAt: new Date(),
    });
  });

  // =========================
  // 6. Generic message (broadcast - optional)
  // =========================
  socket.on("message", (data) => {
    io.emit("message", data);
  });

  // =========================
  // 7. Disconnect
  // =========================
  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);

    users = users.filter((u) => u.socketId !== socket.id);

    io.emit("getUsers", users);
  });
});

httpServer.listen(5000, () => {
  console.log("Socket server running on port 5000");
});