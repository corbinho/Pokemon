import React from "react";
import "../gameOver/gameOver.css";
import Lobby from "../lobby/lobby"



class GameOver extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            winner: this.props.winner,
            playerAChamp: this.props.value.playerAChamp,
            playerBChamp: this.props.value.playerBChamp,
            playerAField: this.props.value.playerAField,
            playerBField: this.props.value.playerBField,
            playerAHand: this.props.value.playerAHand,
            playerBHand: this.props.value.playerBHand,
            playerAGraveyard: this.props.value.playerAGraveyard,
            playerBGraveyard: this.props.value.playerBGraveyard,
            goToLobby: false
        }
    }

    goLobby = () => {
        this.setState({
            goToLobby: true
        })
    }

    render() {
        if (this.state.goToLobby){
            return (
            <Lobby></Lobby>
            )
        } else if (this.state.winner === "playerB") {
            return (<div className="gameOverContainer">
                <div className="innerContainer">

                    <div className="blocks">

                        {/* Left Block */}
                        <div className="left">
                            <div className="playerHeader">
                                <h6>Winner!</h6>
                            </div>
                            <div className="playerHeader">
                                Player 1
                            <h6>Champion Health Remaining {this.state.playerBChamp[0].Health}/100</h6>
                                <h6>Minions Remaining {this.state.playerBField.length + this.state.playerBHand.length}/5</h6>
                                <h6>Minions Destroyed {this.state.playerAGraveyard.length}/5</h6>
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
                            <h6>Champion Health Remaining {this.state.playerAChamp[0].Health}/100</h6>
                                <h6>Minions Remaining {this.state.playerAField.length + this.state.playerAHand.length}/5</h6>
                                <h6>Minions Destroyed {this.state.playerBGraveyard.length}/5</h6>
                            </div>

                        </div>


                    </div>


                </div>
            </div>
            )
        } else {
            return (<div className="gameOverContainer">
                <div className="innerContainer">

                    <div className="blocks">

                        {/* Left Block */}
                        <div className="left">
                            <div className="playerHeader">

                            </div>
                            <div className="playerHeader">
                                Player 1
                            <h6>Champion Health Remaining {this.state.playerBChamp[0].Health}/100</h6>
                                <h6>Minions Remaining {this.state.playerBField.length + this.state.playerBHand.length}/5</h6>
                                <h6>Minions Destroyed {this.state.playerAGraveyard.length}/5</h6>
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
                            <h6>Winner!</h6>
                        <div className="playerHeader">
                                Player 2
                            <h6>Champion Health Remaining {this.state.playerAChamp[0].Health}/100</h6>
                                <h6>Minions Remaining {this.state.playerAField.length + this.state.playerAHand.length}/5</h6>
                                <h6>Minions Destroyed {this.state.playerBGraveyard.length}/5</h6>
                            </div>

                        </div>


                    </div>


                </div>
            </div>
            )
        }
    }
}

export default GameOver;