const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();
const routes = require("./routes")
const mongoose = require("mongoose");
const http = require("http").Server(app);
const socketIO = require('socket.io');
const championList = require('./client/src/components/draftChamp/champions')
const minionsList = require("./client/src/components/draftMinion/minions")


const io = socketIO(http)

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/pokemonDB");

function Game(id){
  this.gameId = id
  this.player1 = false,
  this.player2 = false,
  this.player1name = "",
  this.player2name = ""
}

let roomno = 1;

io.on('connection', function (socket) {

  socket.on('joinNewGame', function(name){
  

  let socketInGame = false;
    
    for (let i = 0; i < io.nsps['/'].adapter.rooms.length; i++){
      if (socket.id === io.nsps['/'].adapter.rooms[i].game.player1.id || socket.id === io.nsps['/'].adapter.rooms[i].game.player2.id){
        socketInGame = true
      } 
    }

    

    if (io.nsps['/'].adapter.rooms["room-" + roomno] && io.nsps['/'].adapter.rooms["room-" + roomno].length === 2 && socketInGame === false) {
      roomno++
    };
    
    socket.join("room-" + roomno);

    if (!io.nsps['/'].adapter.rooms['room-' + roomno].game){
      io.nsps['/'].adapter.rooms['room-' + roomno].game = new Game(roomno);
    } 

    

    // socket is assigned to player 1
    if (!io.nsps['/'].adapter.rooms['room-' + roomno].game.player1) io.nsps['/'].adapter.rooms['room-' + roomno].game.player1 = { id: socket.id };
    // socket is assigned to player 2
    else if (!io.nsps['/'].adapter.rooms['room-' + roomno].game.player2) io.nsps['/'].adapter.rooms['room-' + roomno].game.player2 = { id: socket.id };
    // game is full so I guess this person is just gonna spectate?
    else { }
    
    

    

    let game = io.nsps['/'].adapter.rooms['room-' + roomno].game

    //Send this event to everyone in the room.
    

    socket.on('assignNames', function (name){
      
      if (game.player1name === ""){
        console.log("assigning to player 1 name " + name)
        game.player1name = name
      } else {
        console.log("assigning to player 2 name " + name)
        game.player2name = name
      }

      io.to('room-' + game.gameId).emit('updateGame', game)
    })

  socket.on('joinGame', function (data) {

    socket.on('showTurn', function(){
      
    })

    socket.on('disconnect', function () {
      game.player1 = false
      game.player2 = false
      game.champions = championList.championList
      game.player1.champion = []
      game.player2.champion = []
      game.playerAChamp = []
      game.playerBChamp = []
      game.minions = minionsList.minionsList
      game.player1.minions = []
      game.player2.minions = []
      game.playerAField = []
      game.playerBField = []
      game.playerAHand = []
      game.playerBHand = []
      game.playerAGraveyard = []
      game.playerBGraveyard = []
      game.playerAMana = 20;
      game.playerBMana = 20;
      game.aMaxMana = 20;
      game.bMaxMana = 20;
      game.playerDisconnected = true

      io.of('/').in('room-' + game.gameId).clients((error, socketIds) => {

        
        if (error) throw error;
        
        io.to('room-' + game.gameId).emit('updateGame', game)
        socketIds.forEach(socketId => io.sockets.sockets[socketId].leave('room-' + game.gameId));
        
        
      });

      
    });


    socket.on('draftChampion', function (champions, champion) {
      if (socket.id === game.player1.id && game.player2 !== false) {
        game.player1.champion = champion;
        game.champions = champions
      }
      else if (socket.id === game.player2.id && game.player1 !== false) {
        game.player2.champion = champion;
        game.champions = champions
      }
      
  
      io.to('room-' + game.gameId).emit('updateGame', game)
    })

    socket.on('changeATurn', function (currentAMaxMana, newMana, name) {
      if (socket.id === game.player1.id) {
        console.log("not the right socket, trying to change A's turn")
        return
      }
      else if (socket.id === game.player2.id) {
        
        game.aMaxMana = currentAMaxMana;
        game.playerAMana = newMana;
        game.playerBturn = true;
        game.playerATurn = false;
        game.currentPlayerTurn = name
      }
  
      io.to('room-' + game.gameId).emit('updateGame', game)
  
    })

    socket.on('changeBTurn', function (currentBMaxMana, newMana, name) {
      if (socket.id === game.player2.id) {
        console.log("not the right socket, trying to change B's turn")
        return
      }
      else if (socket.id === game.player1.id) {
        
        game.bMaxMana = currentBMaxMana;
        game.playerBMana = newMana;
        game.playerBturn = false;
        game.playerATurn = true;
        game.currentPlayerTurn = name
      }
      
      io.to('room-' + game.gameId).emit('updateGame', game)
      
    })  
    
    socket.on('draft1Minion', function (minions, minion, name) {
      if (socket.id === game.player1.id) {
        game.player1.minions = minion;
        game.player1.turn = false;
        game.player2.turn = true;
        game.minions = minions;
        game.currentTurn = name;
      }
      else if (socket.id === game.player2.id) {
        return
      }
      
      io.to('room-' + game.gameId).emit('updateGame', game)
    })

    socket.on('draft2Minion', function (minions, minion, name) {
      if (socket.id === game.player2.id) {
        game.player2.minions = minion;
        game.player2.turn = false;
        game.player1.turn = true;
        game.minions = minions;
        game.currentTurn = name;
      }
      else if (socket.id === game.player1.id) {
        return
      }
      
      io.to('room-' + game.gameId).emit('updateGame', game)
    })



    socket.on('board', function (allState) {
      game.playerAChamp = allState.playerAChamp
      game.playerAHand = allState.playerAHand
      game.playerAField = allState.playerAField
      game.playerAGraveyard = allState.playerAGraveyard
      game.playerBChamp = allState.playerBChamp
      game.playerBHand = allState.playerBHand
      game.playerBField = allState.playerBField
      game.playerBGraveyard = allState.playerBGraveyard
      game.playerATurn = allState.playerATurn
      game.playerBturn = allState.playerBturn
      game.playerAMana = allState.playerAMana
      game.playerBMana = allState.playerBMana
      game.aMaxMana = allState.aMaxMana
      game.bMaxMana = allState.bMaxMana
  
      
      io.to('room-' + game.gameId).emit('updateGame', game)
    })

    socket.on('playAHand', function(playerAField, playerAHand, playerAMana){

      if (socket.id === game.player2.id){
      game.playerAField = playerAField
      game.playerAHand = playerAHand
      game.playerAMana = playerAMana
      } else {
        return
      }

      io.to('room-' + game.gameId).emit('updateGame', game)

    })

    socket.on('playBHand', function(playerBField, playerBHand, playerBMana, name){

      if (socket.id === game.player1.id){
      game.playerBField = playerBField
      game.playerBHand = playerBHand
      game.playerBMana = playerBMana
      game.currentPlayerTurn = name
      } else {
        return
      }
      
      io.to('room-' + game.gameId).emit('updateGame', game)

    })

    socket.on('attackAChampion', function(playerAChampion, playerBField, playerBMana, playerBGraveyard){
      if (socket.id === game.player1.id){
        game.playerAChamp = playerAChampion,
        game.playerBField = playerBField,
        game.playerBMana = playerBMana,
        game.playerBGraveyard = playerBGraveyard
      } else {
        return
      }

      io.to('room-' + game.gameId).emit('updateGame', game)
    })

    socket.on('attackBChampion', function(playerBChampion, playerAField, playerAMana, playerAGraveyard){
      if (socket.id === game.player2.id){
        game.playerBChamp = playerBChampion,
        game.playerAField = playerAField,
        game.playerAMana = playerAMana,
        game.playerAGraveyard = playerAGraveyard
      } else {
        return
      }

      io.to('room-' + game.gameId).emit('updateGame', game)
    })

    socket.on('attackBMinion', function(playerAField, playerBField, playerAMana, playerBGraveyard, playerAGraveyard){
      if (socket.id === game.player2.id){
        game.playerAField = playerAField,
        game.playerBField = playerBField,
        game.playerAMana = playerAMana,
        game.playerBGraveyard = playerBGraveyard,
        game.playerAGraveyard = playerAGraveyard
      } else {
        return
      }

      io.to('room-' + game.gameId).emit('updateGame', game)
    })

    socket.on('attackAMinion', function(playerBField, playerAField, playerBMana, playerAGraveyard, playerBGraveyard){
      if (socket.id === game.player1.id){
        game.playerAField = playerAField,
        game.playerBField = playerBField,
        game.playerBMana = playerBMana,
        game.playerBGraveyard = playerBGraveyard,
        game.playerAGraveyard = playerAGraveyard
      } else {
        return
      }

      io.to('room-' + game.gameId).emit('updateGame', game)
    })    

    socket.on('leaveGame', function(){

      
      game.player1 = false
      game.player2 = false
      game.champions = championList.championList
      game.player1.champion = []
      game.player2.champion = []
      game.playerAChamp = []
      game.playerBChamp = []
      game.minions = minionsList.minionsList
      game.player1.minions = []
      game.player2.minions = []
      game.playerAField = []
      game.playerBField = []
      game.playerAHand = []
      game.playerBHand = []
      game.playerAGraveyard = []
      game.playerBGraveyard = []
      game.playerAMana = 20;
      game.playerBMana = 20;
      game.aMaxMana = 20;
      game.bMaxMana = 20;
      
      socket.leave('room-' + game.gameId, function(err){
        console.log('disconnected from the room')
      })
      io.to('room-' + game.gameId).emit('updateGame', game)
      
    })
    
  })
})
})

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




