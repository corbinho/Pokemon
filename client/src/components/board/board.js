import React, { Component } from "react";
import "./board.css";
import "./boardCards.css";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import API from '../../utils/API';
import { isUndefined } from "util";

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

/**
* Moves an item from one list to another list. this function is working as expected
*/

const move = (source, destination, droppableSource, droppableDestination) => {

    const sourceClone = Array.from(source);

    const destClone = Array.from(destination);


    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;
    return result;
};

class GameBoard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            playerAChamp: this.props.p1champ,
            playerAHand: this.props.p1deck,
            playerAField: [],
            playerAGraveyard: [],
            playerBChamp: this.props.p2champ,
            playerBHand: this.props.p2deck,
            playerBField: [],
            playerBGraveyard: [],
            playerATurn: false,
            playerBturn: true,
            playerAMana: 20,
            playerBMana: 20,
            aMaxMana: 20,
            bMaxMana: 20
        }


        this.id2List = {
            playerHandA: 'playerAHand',
            fieldA: 'playerAField',
            playerHandB: 'playerBHand',
            fieldB: 'playerBField',
        };
    }

    componentDidMount = () => {
        API.joinGame(updates => {
            console.log(updates)
            if (updates.player1 && updates.player2) {
                if(updates.playerATurn || updates.playerBturn){
                this.setState({
                    playerAChamp: updates.playerAChamp || this.state.playerAChamp,
                    playerAHand: updates.playerAHand || this.state.playerAHand,
                    playerAField: updates.playerAField || this.state.playerAField,
                    playerAGraveyard: updates.playerAGraveyard || this.state.playerAGraveyard,
                    playerBChamp: updates.playerBChamp || this.state.playerBChamp,
                    playerBHand: updates.playerBHand || this.state.playerBHand,
                    playerBField: updates.playerBField || this.state.playerBField,
                    playerBGraveyard: updates.playerBGraveyard || this.state.playerBGraveyard,
                    playerATurn: updates.playerATurn,
                    playerBturn: updates.playerBturn,
                    playerAMana: updates.playerAMana || this.state.playerAMana,
                    playerBMana: updates.playerBMana || this.state.playerBMana,
                    aMaxMana: updates.aMaxMana || this.state.aMaxMana,
                    bMaxMana: updates.bMaxMana || this.state.bMaxMana
                }, function() {console.log(this.state)}
                )
            } else {
                this.setState({
                    playerAChamp: updates.playerAChamp || this.state.playerAChamp,
                    playerAHand: updates.playerAHand || this.state.playerAHand,
                    playerAField: updates.playerAField || this.state.playerAField,
                    playerAGraveyard: updates.playerAGraveyard || this.state.playerAGraveyard,
                    playerBChamp: updates.playerBChamp || this.state.playerBChamp,
                    playerBHand: updates.playerBHand || this.state.playerBHand,
                    playerBField: updates.playerBField || this.state.playerBField,
                    playerBGraveyard: updates.playerBGraveyard || this.state.playerBGraveyard,
                    playerATurn: this.state.playerATurn,
                    playerBturn: this.state.playerBturn,
                    playerAMana: updates.playerAMana || this.state.playerAMana,
                    playerBMana: updates.playerBMana || this.state.playerBMana,
                    aMaxMana: updates.aMaxMana || this.state.aMaxMana,
                    bMaxMana: updates.bMaxMana || this.state.bMaxMana
                }, function() {console.log(this.state)}
                )
            }
            }
        })
    }

    changeATurn = () => {

        if (this.state.playerATurn === false) {
            return
        } else {
            let currentAMaxMana = this.state.aMaxMana
            if (currentAMaxMana <= 45) {
                currentAMaxMana += 5
                this.setState({
                    playerBturn: true,
                    playerATurn: false,
                    aMaxMana: currentAMaxMana,
                    playerAMana: currentAMaxMana
                }, function () {
                    API.board(this.state)
                })

            }
            else {
                currentAMaxMana = 50
                this.setState({
                    playerBturn: true,
                    playerATurn: false,
                    aMaxMana: currentAMaxMana,
                    playerAMana: currentAMaxMana
                }, function () {
                    API.board(this.state)
                })

            }

        }
    
    }

    changeBTurn = () => {
        
        if (this.state.playerBturn === false) {
            return
        } else {
            let currentBMaxMana = this.state.bMaxMana
            if (currentBMaxMana <= 45) {
                currentBMaxMana += 5
                console.log(currentBMaxMana)
                this.setState({
                    playerBturn: false,
                    playerATurn: true,
                    bMaxMana: currentBMaxMana,
                    playerBMana: currentBMaxMana
                }, function () {
                    API.board(this.state)
                })

            }
            else {
                currentBMaxMana = 50
                this.setState({
                    playerBturn: false,
                    playerATurn: true,
                    bMaxMana: currentBMaxMana,
                    playerBMana: currentBMaxMana
                }, function () {
                    API.board(this.state)
                })

            }

        }
    

    }

    getList = id => this.state[this.id2List[id]];

    onDragEnd = result => {
        const { source, destination } = result;
        console.log(this.state.playerAHand)

        // dropped outside the list
        if (!destination) {
            console.log("not in destination")
            return;
        }

        if (source.droppableId > 0 && destination.droppableId === "fieldA") {
            return
        }

        if (source.droppableId > 0 && destination.droppableId === "fieldB") {
            return
        }

        if (source.droppableId === "fieldB" && destination.droppableId === "fieldB") {
            return
        }

        if (source.droppableId === "playerHandA" && destination.droppableId === "fieldA" && this.state.playerATurn === true) {
            let currentMana = this.state.playerAMana;
            if (currentMana >= 10) {
                const result = move(
                    this.getList(source.droppableId),
                    this.getList(destination.droppableId),
                    source,
                    destination
                );
                currentMana -= 10;

                this.setState({
                    playerAField: result.fieldA,
                    playerAHand: result.playerHandA,
                    playerAMana: currentMana

                }, function () {
                    API.board(this.state)
                });
            } else {
                console.log("out of mana to play card")
            }
            console.log("A current mana = " + currentMana)
        } if (source.droppableId === "playerHandB" && destination.droppableId === "fieldB" && this.state.playerBturn === true) {
            let currentMana = this.state.playerBMana;
            if (currentMana >= 10) {
                const result = move(
                    this.getList(source.droppableId),
                    this.getList(destination.droppableId),
                    source,
                    destination
                );
                currentMana -= 10;

                this.setState({
                    playerBField: result.fieldB,
                    playerBHand: result.playerHandB,
                    playerBMana: currentMana
                }, function () {
                    API.board(this.state)
                });
                console.log("B current mana = " + currentMana)
            } else {
                console.log("out of mana to play a card")
            }
        }
        //attacking player A Champion
        if (source.droppableId !== "playerHandB" && destination.droppableId === "playerChampionA") {

            if (this.state.playerBturn) {
                console.log("running this attack to champion")
                var playerBField = this.state.playerBField;
                var playerBMana = this.state.playerBMana;
                var playerAChampion = this.state.playerAChamp;
                var attackingCardIndex;
                var defendingCardIndex = 0;

                if (playerBMana >= 9) {
                    for (var i = 0; i < playerBField.length; i++) {
                        attackingCardIndex = i
                    }

                    console.log(playerBField[attackingCardIndex])
                    console.log("attacking card index " + attackingCardIndex)

                    var attackingCardType = playerBField[attackingCardIndex].TypeText;
                    var defendingCardWeakness = playerAChampion[defendingCardIndex].WeakAgainstText;
                    var defendingCardStrength = playerAChampion[defendingCardIndex].StrongAgainstText;

                    console.log("attacking card type " + attackingCardType);
                    console.log("defending card weakness " + defendingCardWeakness);

                    if (attackingCardType === defendingCardWeakness) {
                        playerAChampion[0].Health -= 10;
                        playerBMana -= 9;
                    } else if (attackingCardType === defendingCardStrength) {
                        playerAChampion[0].Health -= 3;
                        playerBField[attackingCardIndex].Health -= 3;
                        playerBMana -= 9;
                    } else {
                        playerAChampion[0].Health -= 6;
                        playerBMana -= 9;
                    }

                    if (playerAChampion[0].Health <= 0) {
                        //end game
                    }

                    this.setState({
                        playerAChamp: playerAChampion,
                        playerBField: playerBField,
                        playerBMana: playerBMana
                    }, function () {
                        API.board(this.state)
                    })
                }
            }

        }

        //attacking playerB Champ

        if (source.droppableId !== "playerHandA" && destination.droppableId === "playerChampionB") {

            if (this.state.playerATurn) {
                console.log("running this attack to champion")
                var playerAField = this.state.playerAField;
                var playerAMana = this.state.playerAMana;
                var playerBChampion = this.state.playerBChamp;
                var attackingCardIndex;
                var defendingCardIndex = 0;

                if (playerAMana >= 9) {
                    for (var i = 0; i < playerAField.length; i++) {
                        attackingCardIndex = i
                    }

                    console.log(playerAField[attackingCardIndex])
                    console.log("attacking card index " + attackingCardIndex)

                    var attackingCardType = playerAField[attackingCardIndex].TypeText;
                    var defendingCardWeakness = playerBChampion[defendingCardIndex].WeakAgainstText;
                    var defendingCardStrength = playerBChampion[defendingCardIndex].StrongAgainstText;

                    console.log("attacking card type " + attackingCardType);
                    console.log("defending card weakness " + defendingCardWeakness);

                    if (attackingCardType === defendingCardWeakness) {
                        playerBChampion[0].Health -= 10;
                        playerAMana -= 9;
                    } else if (attackingCardType === defendingCardStrength) {
                        playerBChampion[0].Health -= 3;
                        playerAField[attackingCardIndex].Health -= 3;
                        playerAMana -= 9;
                    } else {
                        playerBChampion[0].Health -= 6;
                        playerAMana -= 9;
                    }

                    if (playerBChampion[0].Health <= 0) {
                        //end game
                    }

                    this.setState({
                        playerBChamp: playerBChampion,
                        playerAField: playerAField,
                        playerAMana: playerAMana
                    }, function () {
                        API.board(this.state)
                    })
                }

            }
        }

        if (destination.droppableId !== "playerChampionA" && destination.droppableId !== "playerChampionB" && source.droppableId !== "fieldA" && source.droppableId !== "fieldB" && source.droppableId !== "playerHandA" && source.droppableId !== "playerHandB") {
            console.log(result);
            console.log("source card index " + result.source.droppableId);
            console.log("destination card index " + result.destination.droppableId);
            if (this.state.playerATurn) {
                var playerAField = this.state.playerAField;
                var playerBField = this.state.playerBField;
                var playerAMana = this.state.playerAMana;
                var playerBGraveyard = this.state.playerBGraveyard;
                var attackingCardIndex;
                var defendingCardIndex;

                if (playerAMana >= 9) {

                    for (var i = 0; i < playerAField.length; i++) {
                        if (playerAField[i].id === result.source.droppableId) {
                            attackingCardIndex = i
                        }
                    }
                    for (var j = 0; j < playerBField.length; j++) {
                        if (playerBField[j].id === result.destination.droppableId) {
                            defendingCardIndex = j
                        }
                    }
                    console.log(playerAField);
                    console.log(attackingCardIndex);
                    console.log(defendingCardIndex);

                    if (defendingCardIndex === undefined){
                        console.log('youre attacking something that doesnt exist')
                        return
                    } else {

                    var attackingCardType = playerAField[attackingCardIndex].TypeText;
                    var defendingCardWeakness = playerBField[defendingCardIndex].WeakAgainst;
                    var defendingCardStrength = playerBField[defendingCardIndex].StrongAgainst;
                    console.log(attackingCardType);
                    console.log(defendingCardWeakness);

                    if (attackingCardType === defendingCardWeakness) {
                        playerBField[defendingCardIndex].Health -= 10;
                        playerAMana -= 9;
                    } else if (attackingCardType === defendingCardStrength) {
                        playerBField[defendingCardIndex].Health -= 3;
                        playerAField[attackingCardIndex].Health -= 3;
                        playerAMana -= 9;
                    } else {
                        playerBField[defendingCardIndex].Health -= 6;
                        playerAMana -= 9;
                    }

                    if (playerBField[defendingCardIndex].Health <= 0) {
                        var removedBCard = playerBField.splice(defendingCardIndex, 1);
                        playerBGraveyard.push(removedBCard);
                    }

                    this.setState({
                        playerAField: playerAField,
                        playerBField: playerBField,
                        playerAMana: playerAMana,
                        playerBGraveyard: playerBGraveyard
                    }, function () {
                        API.board(this.state)
                    })
                    console.log(this.state)
                }
                }
                else {
                    //add some modal to say out of mana
                    console.log("out of mana to attack or moves")
                }



            }
            //player B's turn
            else {
                var playerAField = this.state.playerAField;
                var playerBField = this.state.playerBField;
                var playerBMana = this.state.playerBMana;
                var playerAGraveyard = this.state.playerAGraveyard
                var attackingCardIndex;
                var defendingCardIndex;

                if (playerBMana >= 9) {

                    for (var i = 0; i < playerBField.length; i++) {
                        if (playerBField[i].id === result.source.droppableId) {
                            attackingCardIndex = i
                        }
                    }
                    for (var j = 0; j < playerAField.length; j++) {
                        if (playerAField[j].id === result.destination.droppableId) {
                            defendingCardIndex = j
                        }
                    }
                    console.log(playerBField);
                    console.log(attackingCardIndex);
                    console.log(defendingCardIndex);

                    if (defendingCardIndex === undefined){
                        console.log('youre attacking something that doesnt exist')
                        return
                    } else {

                    var attackingCardType = playerBField[attackingCardIndex].TypeText;
                    var defendingCardWeakness = playerAField[defendingCardIndex].WeakAgainst;
                    var defendingCardStrength = playerAField[defendingCardIndex].StrongAgainst;
                    console.log(attackingCardType);
                    console.log(defendingCardWeakness);

                    if (attackingCardType === defendingCardWeakness) {
                        playerAField[defendingCardIndex].Health -= 10;
                        playerBMana -= 9;
                    } else if (attackingCardType === defendingCardStrength) {
                        playerAField[defendingCardIndex].Health -= 3;
                        playerBField[attackingCardIndex].Health -= 3;
                        playerBMana -= 9;
                    } else {
                        playerAField[defendingCardIndex].Health -= 6;
                        playerBMana -= 9;
                    }

                    if (playerAField[defendingCardIndex].Health <= 0) {
                        var removedACard = playerAField.splice(defendingCardIndex, 1);
                        playerAGraveyard.push(removedACard);
                    }

                    this.setState({
                        playerAField: playerAField,
                        playerBField: playerBField,
                        playerBMana: playerBMana,
                        playerAGraveyard: playerBGraveyard
                    }, function () {
                        API.board(this.state)
                    })


                    console.log(this.state)



                }}
                else {
                    //add some modal to say out of mana
                    console.log("out of mana to attack or moves")
                }
            }
        }

    };

    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>

                <div className="outerContainer">

                    <div className="containerA">

                        <div className="rowA">

                            <div className="playerManaA">
                                {this.state.playerAMana}
                            </div>

                            <div className="endTurnA" onClick={
                                this.changeATurn
                            }>
                                End Turn
                            </div>

                            <Droppable droppableId="playerChampionA">
                                {(provided) => (
                                    <div className="championA" ref={provided.innerRef}>
                                        {this.state.playerAChamp.map((champion) => (
                                            <div
                                                className="playedChampionCard"
                                                id={champion.id}
                                                key={champion.id}
                                            >
                                                <p className="playedChampionHealth">{champion.Health || 2}</p>
                                                <img className="playedChampionWeakness" src={champion.WeakAgainst} alt="" width="42" height="1"></img>
                                                <img className="playedChampionStrength" src={champion.StrongAgainst} alt="" width="5" height="1"></img>
                                                <img className="playedChampionPortrait" src={champion.Img} alt=""></img>
                                            </div>

                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                            <Droppable droppableId="playerHandA">
                                {(provided) => (
                                    <div className="playerHandA" ref={provided.innerRef}>
                                        {this.state.playerAHand.map((minion, index) => (
                                            <Draggable
                                                key={minion.id}
                                                draggableId={minion.id}
                                                index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="minionHandCardA"
                                                        id={minion.id}
                                                        key={minion.id}
                                                    >
                                                        <h3 className="MinionHandName">{minion.Name || "Minion"}</h3>
                                                        <p className="minionHandHealth">{minion.Health || 2}</p>

                                                        <div className="ability">
                                                            <span className="minionHandAttack1">{minion.Attack1Name || "Ability 1"}</span>
                                                            <span className="minionHandAttack1Power"><br></br>Dmg: {minion.Attack1Power}</span>
                                                            <span className="minionHandAttack1Cost">Cost: {minion.Attack1Cost}</span>
                                                        </div>




                                                        <img className="minionHandWeakness" src={minion.WeakAgainstImg} alt="" width="42" height="1"></img>
                                                        <img className="minionHandStrength" src={minion.StrongAgainstImg} alt="" width="5" height="1"></img>
                                                        <img className="minionHandPortrait" src={minion.Img} alt=""></img>

                                                    </div>


                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}

                                    </div>
                                )
                                }

                            </Droppable>
                        </div>
                        <Droppable droppableId="fieldA">
                            {(provided) => (
                                <div className="fieldA" ref={provided.innerRef}>
                                    {this.state.playerAField.map((minion, index) => (
                                        <Droppable droppableId={minion.id} key={minion.id}>
                                            {(provided) => (
                                                <div className="droppableMinion" ref={provided.innerRef} key={minion.id}>
                                                    <Draggable
                                                        key={minion.id}
                                                        draggableId={minion.id}
                                                        index={index}>
                                                        {(provided) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className="minionFieldCardA"
                                                                id={minion.id}
                                                                key={minion.id}
                                                            >
                                                                <h3 className="MinionFieldName">{minion.Name || "Minion"}</h3>
                                                                <p className="minionFieldHealth">{minion.Health || 2}</p>

                                                                <div className="ability">
                                                                    <span className="minionFieldAttack1">{minion.Attack1Name || "Ability 1"}</span>
                                                                    <span className="minionFieldAttack1Power"><br></br>Dmg: {minion.Attack1Power}</span>
                                                                    <span className="minionFieldAttack1Cost">Cost: {minion.Attack1Cost}</span>
                                                                </div>




                                                                <img className="minionFieldWeakness" src={minion.WeakAgainstImg} alt="" width="42" height="1"></img>
                                                                <img className="minionFieldStrength" src={minion.StrongAgainstImg} alt="" width="5" height="1"></img>
                                                                <img className="minionFieldPortrait" src={minion.Img} alt=""></img>

                                                            </div>


                                                        )}
                                                    </Draggable>
                                                    {provided.placeholder}
                                                </div>

                                            )}
                                        </Droppable>
                                    ))}
                                    {provided.placeholder}

                                </div>
                            )
                            }
                        </Droppable>

                    </div>


                    <div className="containerB">

                        <Droppable droppableId="fieldB">
                            {(provided) => (
                                <div className="fieldB" ref={provided.innerRef}>
                                    {this.state.playerBField.map((minion, index) => (
                                        <Droppable droppableId={minion.id} key={minion.id}>
                                            {(provided) => (
                                                <div className="droppableMinion" ref={provided.innerRef} key={minion.id}>
                                                    <Draggable
                                                        key={minion.id}
                                                        draggableId={minion.id}
                                                        index={index}>
                                                        {(provided) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className="minionFieldCardB"
                                                                id={minion.id}
                                                                key={minion.id}
                                                            >
                                                                <h3 className="MinionFieldName">{minion.Name || "Minion"}</h3>
                                                                <p className="minionFieldHealth">{minion.Health || 2}</p>

                                                                <div className="ability">
                                                                    <span className="minionFieldAttack1">{minion.Attack1Name || "Ability 1"}</span>
                                                                    <span className="minionFieldAttack1Power"><br></br>Dmg: {minion.Attack1Power}</span>
                                                                    <span className="minionFieldAttack1Cost">Cost: {minion.Attack1Cost}</span>
                                                                </div>




                                                                <img className="minionFieldWeakness" src={minion.WeakAgainstImg} alt="" width="42" height="1"></img>
                                                                <img className="minionFieldStrength" src={minion.StrongAgainstImg} alt="" width="5" height="1"></img>
                                                                <img className="minionFieldPortrait" src={minion.Img} alt=""></img>

                                                            </div>


                                                        )}
                                                    </Draggable>
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    ))}
                                    {provided.placeholder}

                                </div>
                            )
                            }
                        </Droppable>

                        <div className="rowB">

                            <div className="endTurnB" onClick={
                                this.changeBTurn
                            }>
                                End Turn
                            </div>

                            <div className="playerManaB">
                                {this.state.playerBMana}
                            </div>

                            <Droppable droppableId="playerChampionB">
                                {(provided) => (
                                    <div className="championB" ref={provided.innerRef}>
                                        {this.state.playerBChamp.map((champion) => (
                                            <div
                                                className="playedChampionCard"
                                                id={champion.id}
                                                key={champion.id}
                                            >
                                                <p className="playedChampionHealth">{champion.Health || 2}</p>
                                                <img className="playedChampionWeakness" src={champion.WeakAgainst} alt="" width="42" height="1"></img>
                                                <img className="playedChampionStrength" src={champion.StrongAgainst} alt="" width="5" height="1"></img>
                                                <img className="playedChampionPortrait" src={champion.Img} alt=""></img>
                                            </div>

                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                            <Droppable droppableId="playerHandB">
                                {(provided) => (
                                    <div className="playerHandB" ref={provided.innerRef}>
                                        {this.state.playerBHand.map((minion, index) => (
                                            <Draggable
                                                key={minion.id}
                                                draggableId={minion.id}
                                                index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="minionHandCardB"
                                                        id={minion.id}
                                                        key={minion.id}
                                                    >
                                                        <h3 className="MinionHandName">{minion.Name || "Minion"}</h3>
                                                        <p className="minionHandHealth">{minion.Health || 2}</p>

                                                        <div className="ability">
                                                            <span className="minionHandAttack1">{minion.Attack1Name || "Ability 1"}</span>
                                                            <span className="minionHandAttack1Power"><br></br>Dmg: {minion.Attack1Power}</span>
                                                            <span className="minionHandAttack1Cost">Cost: {minion.Attack1Cost}</span>
                                                        </div>




                                                        <img className="minionHandWeakness" src={minion.WeakAgainstImg} alt="" width="42" height="1"></img>
                                                        <img className="minionHandStrength" src={minion.StrongAgainstImg} alt="" width="5" height="1"></img>
                                                        <img className="minionHandPortrait" src={minion.Img} alt=""></img>

                                                    </div>


                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}

                                    </div>
                                )
                                }
                            </Droppable>
                        </div>
                    </div>


                </div>
            </DragDropContext>
        )
    }
}
export default GameBoard;