import React from "react";
import "../lobby/lobby.css"



class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sockets: this.props.value
    }

  }

  render() {
    return <div className="lobbyContainer">

      <div className="panels">

      <div className="leftPanel">

        

      </div>



      <div className="rightPanel">

        <div className="createGame">
          <div className="header">Create a New Game</div>
          <input type="text" name="name" className="inputField" placeholder="Enter your name" required></input>
          <br></br>
          <button className="createGameBtn" onClick={this.createGame} >Create a Game {this.state.playerASocket}</button>

        </div>

        <div className="joinGame">
          <div className="header">Join a Game</div>
          <input type="text" name="name" className="inputField" placeholder="Enter your name" required></input>
          <br></br>
				  <input type="text" name="room" className="inputField" placeholder="Enter Game ID" required></input>
          <br></br>
          <button className="joinGameBtn" onClick={this.joinGame}>Join a Game {this.state.playerBSocket}</button>

        </div>
      

      </div>

      </div>
    </div>;
  }
}

export default Lobby;