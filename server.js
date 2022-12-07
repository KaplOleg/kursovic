// const path = require('path');
const {version, validate} = require('uuid');
const ACTIONS = require('./src/socket/Actions');

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const PORT = process.env.PORT || 3001;

function shareRooms() {
  const {rooms} = io.sockets.adapter;

  io.emit(ACTIONS.SHARE_ROOMS, {
    rooms: Array.from(rooms.keys()).filter(roomID => validate(roomID) && version(roomID) === 4)
  });
}

function leaveRoom(socket) {
  const {rooms} = socket;

  Array.from(rooms)
    .filter(roomID => validate(roomID) && version(roomID) === 4)
    .forEach(roomID => {

      const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || []);

      clients
        .forEach(clientID => {
          io.to(clientID).emit(ACTIONS.REMOVE_PEER, {
            peerID: socket.id,
          });

          socket.emit(ACTIONS.REMOVE_PEER, {
            peerID: clientID,
          });
        });
        socket.leave(roomID);
    });
  shareRooms();
}

io.on('connection', socket => {
  console.log(`Сокет ${socket.id} подключился!`);
  shareRooms();

  socket.on(ACTIONS.JOIN, config => {
    const {room: roomID} = config;
    const {rooms: joinedRooms} = socket;

    if (Array.from(joinedRooms).includes(roomID)) {
      return console.warn(`Сокет уже подключен к этой комнате: ${roomID}`);
    }

    const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || []);

    clients.forEach(clientID => {
      io.to(clientID).emit(ACTIONS.ADD_PEER, {
        peerID: socket.id,
        createOffer: false
      });

      socket.emit(ACTIONS.ADD_PEER, {
        peerID: clientID,
        createOffer: true,
      });
    });
    socket.join(roomID);
    shareRooms();
  });

  socket.on(ACTIONS.LEAVE, () => leaveRoom(socket));
  socket.on('disconnecting', () => leaveRoom(socket));

  socket.on(ACTIONS.RELAY_SDP, ({peerID, sessionDescription}) => {
    io.to(peerID).emit(ACTIONS.SESSION_DESCRIPTION, {
      peerID: socket.id,
      sessionDescription,
    });
  });
  
  socket.on(ACTIONS.RELAY_ICE, ({peerID, iceCandidate}) => {
    io.to(peerID).emit(ACTIONS.ICE_CANDIDATE, {
      peerID: socket.id,
      iceCandidate,
    });
  });
});

// const publicPath = path.join(__dirname, 'build');
// app.use(express.static(publicPath));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(publicPath, 'index.html'));
// });

server.listen(PORT, () => {
  console.log(`Серверт открыт на порте ${PORT}`)
})