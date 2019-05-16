const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();
const routes = require("./routes")
const mongoose = require("mongoose");
const http = require("http").Server(app);
const socketIO = require('socket.io');


const io = socketIO(http)
// io.set('transports', ['websocket'])

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/pokemonDB");

io.on('connection', socket => {
  console.log("User Connected")

  socket.on('disconnect', function () {
    console.log('a user disconnected')
  });
})

app.all('/', function(req, res, next) {
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

http.listen(PORT, function() {
  console.log(`🌎 ==> API server now on port ${PORT}!`);
});



