// server.js (rename index.js to server.js or use a different filename)
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app); // Create an HTTP server instance
const io = socketIo(server, {
    cors: {
        origin: '*',
    },
}); // Attach Socket.IO to the HTTP server

// Handle new socket connections
// let connectedUsers = [];
io.on('connection', (socket) => {
    console.log('A user connected', socket.id);
    // connectedUsers.push(socket.id);
    // io.emit("getUsers", connectedUsers);

    socket.on("joinRoom", (room) => {
        console.log(room)
        socket.join(room);
    });

    socket.on("leaveRoom", (room) => {
        socket.leave(room);
    });

    socket.on('privateMessage', ({ room, message }) => {
        socket.to(room).emit('privateMessage', message);
        console.log(`Private message sent from ${socket.id} to ${room}:`, message);
    });

    // Handle a custom event sent from the client
    socket.on('message', (data) => {
        console.log('Message received:', data);

        // Broadcast the message to all connected clients
        socket.emit('message', data);
    });

    // Handle disconnections
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // Export the Express app if needed for integration with Next.js
