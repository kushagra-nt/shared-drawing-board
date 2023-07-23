const express = require('express');
const http = require('http');
const app = express();

const server = http.createServer(app);

import {Server} from 'socket.io';

const io = new Server(server, {
    cors: {
        origin: '*'
    }
})

type Point = {
    x: number,
    y: number,
}

type DrawLine = {
    prevPoint: Point | null,
    currentPoint: Point,
    color: string,
}

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('draw-line', ({prevPoint, currentPoint, color}: DrawLine) => {
        socket.broadcast.emit('draw-line', {prevPoint, currentPoint, color});
    })

    socket.on('clear-canvas', () => {
        console.log('here server side clear')
        io.emit('clear-canvas');
    });
});

server.listen(3001, () => {
    console.log('listening on *:3001');
});