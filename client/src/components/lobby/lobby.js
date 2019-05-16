// import React from "react";
// import "../lobby/lobby.css"



// class Lobby extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       sockets: this.props.value
//     }

//   }

//   createGame = () => {
//   let player = function (name){
//     this.name = name
//   }

//   let socket = io.connect('http://localhost:3001' , player , game)
//   socket.emit('createGame')
//   player = new Player (P1)
  
//   }

//   joinGame = (game) => {
//     let gameID = game
//     socket.emit('joinGame', {room: gameID})
//   } 

//   render() {
//     return <div className="lobbyContainer">

//       <div className="leftPanel">

//         <button className="createGameBtn" onClick={this.createGame} >Create a Game {this.state.playerASocket}</button>

//       </div>

//       <div className="rightPanel">

//         <button className="joinGameBtn" onClick={this.joinGame}>Join a Game {this.state.playerBSocket}</button>

//       </div>

//     </div>;
//   }
// }

// export default Lobby;