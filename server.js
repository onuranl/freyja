const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.Server(app);

const io = socketio(server, {
    cors: {
        origin: '*',
    },
});

let connectedUsers = [];

io.on('connection', (socket) => {
    connectedUsers.push(socket.id);

    const otherUsers = connectedUsers.filter(socketId => socketId !== socket.id);

    socket.emit('other-users', otherUsers);

    socket.on('offer', (socketId, description) => {
        socket.to(socketId).emit('offer', socket.id, description);
    });

    socket.on('answer', (socketId, description) => {
        socket.to(socketId).emit('answer', description);
    });

    socket.on('candidate', (socketId, candidate) => {
        socket.to(socketId).emit('candidate', candidate);
    });

    socket.on('disconnect', () => {
        connectedUsers = connectedUsers.filter(socketId => socketId !== socket.id);
    });
});

server.listen(process.env.PORT || 8000,
    () => console.log('Server Listen On: *:', process.env.PORT || 8000));