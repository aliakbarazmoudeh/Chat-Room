const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

const { createServer } = require('http');
const { disconnect } = require('process');
const { Server } = require('socket.io');

const server = createServer(app);
const io = new Server(server);

app.use(express.static('public'));

server.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);
});

let users = {};
io.on('connection', (socket) => {
  socket.on('onlineUsers', (nickname) => {
    !Object.keys(users).find(
      (user) => user === socket.request.connection._peername.address
    )
      ? (users[socket.request.connection._peername.address] = nickname)
      : null;
    io.sockets.emit('onlineMembers', users);
  });
  socket.on('login', (data) => {
    console.log(
      `user connected with IP : ${socket.request.connection._peername.address}`
    );
  });
  socket.on('chat message', (message) => {
    io.sockets.emit('chat message', message);
  });
  socket.on('typing status', (data) => {
    socket.broadcast.emit('typing status', data);
  });
  socket.on('disconnect', (data) => {
    delete users[socket.request.connection._peername.address];
    io.sockets.emit('onlineMembers', users);
  });
});
