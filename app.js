const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let users = {}; // Store connected users

io.on('connection', (socket) => {
    console.log('A user connected');

    // Send automatic greeting message
    socket.emit('chatMessage', {
        sender: 'Server',
        time: new Date().toLocaleTimeString(),
        text: 'Hi, How are you?'
    });

    // Add user to the list
    socket.on('addUser', (username) => {
        users[socket.id] = username;
        io.emit('userList', Object.values(users));
    });

    // Handle incoming messages
    socket.on('chatMessage', (message) => {
        console.log('Message received:', message);
        // Broadcast the message to all connected clients
        io.emit('chatMessage', message);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        delete users[socket.id];
        io.emit('userList', Object.values(users));
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
