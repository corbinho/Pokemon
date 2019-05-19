import React from "react";
import "../gameOver/gameOver.css"



class GameOver extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            winner: this.props.winner,
            playerAChamp: this.props.playerAChamp,
            playerBChamp: this.props.playerBChamp,
            playerAField: this.props.playerAField,
            playerBField: this.props.playerBField,
            playerAHand: this.props.playerAHand,
            playerBHand: this.props.playerBHand,
            playerAGraveyard: this.props.playerAGraveyard,
            playerBGraveyard: this.props.playerBGraveyard
        }


    }

    render() {
        return <div className="gameOverContainer">
            <div className="innerContainer">

                <div className="blocks">

                    {/* Left Block */}
                    <div className="left">

                        <div className="playerHeader">
                            Player 1
                        </div>
                    
                    </div>

                    {/* Middle Block */}
                    <div className="middle">
                    
                        <div className="winLose">
                            <p className="winLoseMsg">Victory!</p>
                        </div>

                        <br></br>

                        <div className="btnContainer">
                            <button className="goLobby" onClick={this.goLobby}>Go to Lobby</button>
                        </div>

                    </div>

                    {/* Right Block */}
                    <div className="right">
                    
                        <div className="playerHeader">
                            Player 2
                        </div>

                    </div>

                
                </div>


            </div>
        </div>
    }
}

export default GameOver;