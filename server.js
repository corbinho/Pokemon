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
  this.player2 = false
}

// keep track of the game
// let game = {
//   player1: false,
//   player2: false
// };

let roomno = 1;

io.on('connection', function (socket) {
  console.log("User Connected " + socket.id)

  let socketInGame = false;
    
    for (let i = 0; i < io.nsps['/'].adapter.rooms.length; i++){
      if (socket.id === io.nsps['/'].adapter.rooms[i].game.player1.id || socket.id === io.nsps['/'].adapter.rooms[i].game.player2.id){
        socketInGame = true
      } 
    }

    console.log(socketInGame)

    if (io.nsps['/'].adapter.rooms["room-" + roomno] && io.nsps['/'].adapter.rooms["room-" + roomno].length === 2 && socketInGame === false) {
      roomno++
    };
    
    socket.join("room-" + roomno);

    if (!io.nsps['/'].adapter.rooms['room-' + roomno].game){
      io.nsps['/'].adapter.rooms['room-' + roomno].game = new Game(roomno);
    } 

    console.log(io.nsps['/'].adapter.rooms['room-' + roomno])

    // socket is assigned to player 1
    if (!io.nsps['/'].adapter.rooms['room-' + roomno].game.player1) io.nsps['/'].adapter.rooms['room-' + roomno].game.player1 = { id: socket.id };
    // socket is assigned to player 2
    else if (!io.nsps['/'].adapter.rooms['room-' + roomno].game.player2) io.nsps['/'].adapter.rooms['room-' + roomno].game.player2 = { id: socket.id };
    // game is full so I guess this person is just gonna spectate?
    else { }

    console.log(io.nsps['/'].adapter.rooms['room-' + roomno].game)

    let game = io.nsps['/'].adapter.rooms['room-' + roomno].game

    //Send this event to everyone in the room.
    console.log("You are in room no. " + roomno);

  socket.on('joinGame', function (data) {
    
    //Increase roomno 2 clients are present in a room.

    

    socket.on('disconnect', function () {
      // if (socket.id === game.player1) {
      // game.player1 = game.player2;
      // game.player2 = false;
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
      
      
      io.to('room-' + game.gameId).emit('updateGame', game)
  
      
      console.log("disconnected")
      
    });

    socket.on('draftChampion', function (champions, champion) {
      if (socket.id === game.player1.id) {
        game.player1.champion = champion;
        game.champions = champions
      }
      else if (socket.id === game.player2.id) {
        game.player2.champion = champion;
        game.champions = champions
      }
      console.log(game)
  
      io.to('room-' + game.gameId).emit('updateGame', game)
    })

    socket.on('changeATurn', function (currentAMaxMana, newMana) {
      if (socket.id === game.player1.id) {
        console.log("not the right socket, trying to change A's turn")
        return
      }
      else if (socket.id === game.player2.id) {
        console.log("changing A's turn")
        game.aMaxMana = currentAMaxMana;
        game.playerAMana = newMana;
        game.playerBturn = true;
        game.playerATurn = false
      }
  
      io.to('room-' + game.gameId).emit('updateGame', game)
  
    })

    socket.on('changeBTurn', function (currentBMaxMana, newMana) {
      if (socket.id === game.player2.id) {
        console.log("not the right socket, trying to change B's turn")
        return
      }
      else if (socket.id === game.player1.id) {
        console.log("changing B's turn")
        game.bMaxMana = currentBMaxMana;
        game.playerBMana = newMana;
        game.playerBturn = false;
        game.playerATurn = true
      }
  
      io.to('room-' + game.gameId).emit('updateGame', game)
  
    })  
    
    socket.on('draftMinion', function (minions, minion) {
      if (socket.id === game.player1.id) {
        game.player1.minions = minion;
        game.player1.turn = false;
        game.player2.turn = true;
        game.minions = minions
      }
      else if (socket.id === game.player2.id) {
        game.player2.minions = minion;
        game.player2.turn = false;
        game.player1.turn = true;
        game.minions = minions
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
    
  })
})

//   socket.on('disconnect', function () {
//     // if (socket.id === game.player1) {
//     // game.player1 = game.player2;
//     // game.player2 = false;
//     game.player1 = false
//     game.player2 = false
//     game.champions = championList.championList
//     game.player1.champion = []
//     game.player2.champion = []
//     game.playerAChamp = []
//     game.playerBChamp = []
//     game.minions = minionsList.minionsList
//     game.player1.minions = []
//     game.player2.minions = []
//     game.playerAField = []
//     game.playerBField = []
//     game.playerAHand = []
//     game.playerBHand = []
//     game.playerAGraveyard = []
//     game.playerBGraveyard = []
//     game.playerAMana = 20;
//     game.playerBMana = 20;
//     game.aMaxMana = 20;
//     game.bMaxMana = 20;
    
//     console.log(game);
//     io.emit('updateGame', game)

    
//     console.log("disconnected")
//     console.log(game);
//   });

//   socket.on('draftChampion', function (champions, champion) {
//     if (socket.id === game.player1.id) {
//       game.player1.champion = champion;
//       game.champions = champions
//     }
//     else if (socket.id === game.player2.id) {
//       game.player2.champion = champion;
//       game.champions = champions
//     }
//     console.log(game)

//     io.emit('updateGame', game)
//   })

//   socket.on('changeATurn', function (currentAMaxMana, newMana) {
//     if (socket.id === game.player1.id) {
//       console.log("not the right socket, trying to change A's turn")
//       return
//     }
//     else if (socket.id === game.player2.id) {
//       console.log("changing A's turn")
//       game.aMaxMana = currentAMaxMana;
//       game.playerAMana = newMana;
//       game.playerBturn = true;
//       game.playerATurn = false
//     }

//     io.emit('updateGame', game)

//   })

//   socket.on('changeBTurn', function (currentBMaxMana, newMana) {
//     if (socket.id === game.player2.id) {
//       console.log("not the right socket, trying to change B's turn")
//       return
//     }
//     else if (socket.id === game.player1.id) {
//       console.log("changing B's turn")
//       game.bMaxMana = currentBMaxMana;
//       game.playerBMana = newMana;
//       game.playerBturn = false;
//       game.playerATurn = true
//     }

//     io.emit('updateGame', game)

//   })

//   socket.on('draftMinion', function (minions, minion) {
//     if (socket.id === game.player1.id) {
//       game.player1.minions = minion;
//       game.player1.turn = false;
//       game.player2.turn = true;
//       game.minions = minions
//     }
//     else if (socket.id === game.player2.id) {
//       game.player2.minions = minion;
//       game.player2.turn = false;
//       game.player1.turn = true;
//       game.minions = minions
//     }
//     console.log(game)

//     io.emit('updateGame', game)
//   })

//   socket.on('checkSocket', function () {
//     let returnedSocket
//     if (socket.id === game.player1.id) {
//       returnedSocket = true
//     } else {
//       returnedSocket = false
//     }

//     io.emit('giveSocket', returnedSocket)
//   })

//   socket.on('board', function (allState) {
//     game.playerAChamp = allState.playerAChamp
//     game.playerAHand = allState.playerAHand
//     game.playerAField = allState.playerAField
//     game.playerAGraveyard = allState.playerAGraveyard
//     game.playerBChamp = allState.playerBChamp
//     game.playerBHand = allState.playerBHand
//     game.playerBField = allState.playerBField
//     game.playerBGraveyard = allState.playerBGraveyard
//     game.playerATurn = allState.playerATurn
//     game.playerBturn = allState.playerBturn
//     game.playerAMana = allState.playerAMana
//     game.playerBMana = allState.playerBMana
//     game.aMaxMana = allState.aMaxMana
//     game.bMaxMana = allState.bMaxMana

//     console.log(game)
//     io.emit('updateGame', game)
//   })

  


// })

// function resetGame() {

// }

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




