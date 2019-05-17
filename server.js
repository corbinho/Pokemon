const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();
const routes = require("./routes")
const mongoose = require("mongoose");
const http = require("http").Server(app);
const socketIO = require('socket.io');

let rooms = 0;

const io = socketIO(http)
// io.set('transports', ['websocket'])

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/pokemonDB");



io.sockets.on('connection', function (socket) {


  console.log("User Connected " + socket.id)

  socket.on('joinGame', function (data) {
    console.log('joining new game')
    socket.join(data.room);
    //get all clients in the room
    let clients = io.sockets.adapter.rooms['global'].sockets;

    console.log(clients)

  })

  socket.on('update', function (data){
    let clients = io.sockets.adapter.rooms['global'].sockets;
    io.in('global').emit('receive code', data);
    console.log("updating")
    io.in('global').emit('receive users', clients)
  })

  socket.on('disconnect', function (socket) {
    console.log('a user disconnected' + socket.id)
  });

  socket.on('updateMinions', function (data){
    socket.to('global').emit('receive minions', data);
    console.log(data)
    console.log("updating minion code")
  })


})




// socket.on('joinGame', function (data) {
//   var room = io.nsps['/'].adapter.rooms[data.room];
//   if (room && room.length == 1) {
//     socket.join(data.room);
//     socket.broadcast.to(data.room).emit('player1', {});
//     socket.emit('player2', {room: data.room })
//   }
//   else {
//     socket.emit('err', { message: 'Sorry, The room is full!' });
//   }

// })

//   socket.on("roomChanged", function(data) {
//     console.log("roomChanged", data);
// });

// socket.on('createGame', function(data){
//   socket.join('room-' + ++rooms);
//   socket.emit('newGame', {room: 'room-'+rooms});
// });








app.all('/', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.use(routes);

app.use(express.static('../public'))

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

http.listen(PORT, function () {
  console.log(`🌎 ==> API server now on port ${PORT}!`);
});




