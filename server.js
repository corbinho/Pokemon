const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();
const routes = require("./routes")
const mongoose = require("mongoose");
const http = require("http").Server(app);
const socketIO = require('socket.io');


const io = socketIO(http)

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/pokemonDB");

// keep track of the game
let game = {
  player1: false,
  player2: false
};

io.on('connection', function (socket) {
  console.log("User Connected " + socket.id)

  socket.on('joinGame', function (data) {
    console.log('joining new game')

    // socket is assigned to player 1
    if (!game.player1) game.player1 = { id: socket.id };
    // socket is assigned to player 2
    else if (!game.player2) game.player2 = { id: socket.id };
    // game is full so I guess this person is just gonna spectate?
    else { }

    console.log(game)
  })

  socket.on('disconnect', function () {
    if (socket.id === game.player1) {
      game.player1 = game.player2;
      game.player2 = false;
      resetGame()
    }
    else if (socket.id === game.player2) {
      game.player2 = false;
      resetGame()
    }
    console.log(socket)
    console.log(game)
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

    io.emit('updateGame', game)
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
    console.log(game)

    io.emit('updateGame', game)
  })

  socket.on('board', function(currentState){
    game.playerAChamp = currentState.playerAChamp
    game.playerAHand = currentState.playerAHand,
    game.playerAField=  currentState.playerAField,
    game.playerAGraveyard= currentState.playerAGraveyard,
    game.playerBChamp = currentState.playerBChamp,
    game.playerBHand = currentState.playerBHand,
    game.playerBField = currentState.playerBField,
    game.playerBGraveyard = currentState.playerBGraveyard,
    game.playerATurn =currentState.playerATurn,
    game.playerBturn = currentState.playerBTurn,
    game.playerAMana = currentState.playerAMana,
    game.playerBMana =currentState.playerBMana,
    game.aMaxMana = currentState.aMaxMana,
    game.bMaxMana = currentState.bMaxMana

    console.log(game)

    io.emit('updateGame', game)
  })
})

function resetGame() {
  // this function still needs to be implemented
  // you can probably just make the browser refresh
  // if someone rage quits
}

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




