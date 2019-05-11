import React, { Component } from "react";
import "./board.css";
import "./boardCards.css";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
    // console.log(result);
    return result;
};

class GameBoard extends Component {
    state = {
        playerAChamp: [{
            "id": "4",
            "name": "Pikachu",
            "type": "../images/electricOrb.png",
            "TypeType": "electric",
            "Health": 80,
            "WeakAgainstText": "ground",
            "StrongAgainstText": "water",
            "WeakAgainst": "../images/groundOrb.png",
            "StrongAgainst": "../images/waterOrb.png",
            "Img": "../images/pikachu.jpg"
          }],
        playerAHand: [{
            "id": "17",
            "Name": "Vaporeon",
            "Type": "../images/waterOrb.png",
            "TypeText": "water",
            "Attack1Name": "Surf",
            "Attack1Power": 6,
            "Attack1Cost": 9,
            "Attack2Name": "Blizzard",
            "Attack2Power": 9,
            "Attack2Cost": 13,
            "Health": 20,
            "WeakAgainst": "grass",
            "StrongAgainst": "fire",
            "WeakAgainstImg": "../images/grassOrb.png",
            "StrongAgainstImg": "../images/fireOrb.png",
            "Img": "../images/vaporeon.jpg"
        },
        {
            "id": "18",
            "Name": "Zapdos",
            "Type": "../images/electricOrb.png",
            "TypeText": "electric",
            "Attack1Name": "Sky Attack",
            "Attack1Power": 6,
            "Attack1Cost": 9,
            "Attack2Name": "Thunder",
            "Attack2Power": 9,
            "Attack2Cost": 13,
            "Health": 20,
            "WeakAgainst": "ground",
            "StrongAgainst": "water",
            "WeakAgainstImg": "../images/groundOrb.png",
            "StrongAgainstImg": "../images/waterOrb.png",
            "Img": "../images/Zapdos.jpg"
        }],
        playerAField: [],
        playerAGraveyard: [],
        playerBChamp: [{
            "id": "3",
            "name": "Mewtwo",
            "type": "../images/psychicOrb.png",
            "TypeText": "psychic",
            "Health": 80,
            "WeakAgainstText": "dark",
            "StrongAgainstText": "fighting",
            "WeakAgainst": "../images/darkOrb.png",
            "StrongAgainst": "../images/fightingOrb.png",
            "Img": "../images/Mewtwo.jpg"
          }],
        playerBHand: [{
            "id": "15",
            "Name": "Rapidash",
            "Type": "../images/fireOrb.png",
            "TypeText": "fire",
            "Attack1Name": "Fire Blast",
            "Attack1Power": 6,
            "Attack1Cost": 9,
            "Attack2Name": "Flare Blitz",
            "Attack2Power": 9,
            "Attack2Cost": 13,
            "Health": 20,
            "WeakAgainst": "water",
            "StrongAgainst": "grass",
            "WeakAgainstImg": "../images/waterOrb.png",
            "StrongAgainstImg": "../images/grassOrb.png",
            "Img": "../images/Rapidash.jpg"
        },
        {
            "id": "16",
            "Name": "Snorlax",
            "Type": "../images/normalOrb.png",
            "TypeText": "normal",
            "Attack1Name": "Pay Day",
            "Attack1Power": 6,
            "Attack1Cost": 9,
            "Attack2Name": "Body Slam",
            "Attack2Power": 9,
            "Attack2Cost": 13,
            "Health": 20,
            "WeakAgainst": "none",
            "StrongAgainst": "none",
            "WeakAgainstImg": "none",
            "StrongAgainstImg": "none",
            "Img": "../images/Snorlax.jpg"
        }],
        playerBField: [],
        playerBGraveyard: [],
        playerATurn: true,
        playerBturn: false,
        playerAMana: 20,
        playerBMana: 20,
    }

    id2List = {
        playerHandA: 'playerAHand',
        fieldA: 'playerAField',
        playerHandB: 'playerBHand',
        fieldB: 'playerBField',
    };

    getList = id => this.state[this.id2List[id]];

    onDragEnd = result => {
        const { source, destination } = result;


        // dropped outside the list
        if (!destination) {
            console.log("not in destination")
            return;
        }

        if (source.droppableId > 0 && destination.droppableId === "fieldA"){
            return
        }

        if (source.droppableId > 0 && destination.droppableId === "fieldB"){
            return
        }

        if (source.droppableId === "fieldB" && destination.droppableId === "fieldB"){
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
                });
                console.log("B current mana = " + currentMana)
            } else {
                console.log("out of mana to play a card")
            }
        }
        //attacking player A Champion
        if(source.droppableId !== "playerHandB" && destination.droppableId === "playerChampionA"){
            
            if (this.state.playerBturn){
                console.log("running this attack to champion")
                var playerBField = this.state.playerBField;
                var playerBMana = this.state.playerBMana;
                var playerAChampion = this.state.playerAChamp;
                var attackingCardIndex;
                var defendingCardIndex = 0;

                if (playerBMana >= 6){
                    for (var i = 0; i < playerBField.length; i++){
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
                    playerBMana -= 6;
                } else if (attackingCardType === defendingCardStrength) {
                    playerAChampion[0].Health -= 3;
                    playerBField[attackingCardIndex].Health -= 3;
                    playerBMana -= 6;
                } else {
                    playerAChampion[0].Health -= 6;
                    playerBMana -= 6;
                }

                if (playerAChampion[0].Health <= 0) {
                    //end game
                }

                this.setState({
                    playerAChamp: playerAChampion,
                    playerBField: playerBField,
                    playerBMana: playerAMana
                })
            }
            }
        }        

        //attacking playerB Champ

        if(source.droppableId !== "playerHandA" && destination.droppableId === "playerChampionB"){
            
            if (this.state.playerATurn){
                console.log("running this attack to champion")
                var playerAField = this.state.playerAField;
                var playerAMana = this.state.playerAMana;
                var playerBChampion = this.state.playerBChamp;
                var attackingCardIndex;
                var defendingCardIndex = 0;

                if (playerAMana >= 6){
                    for (var i = 0; i < playerAField.length; i++){
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
                    playerAMana -= 6;
                } else if (attackingCardType === defendingCardStrength) {
                    playerBChampion[0].Health -= 3;
                    playerAField[attackingCardIndex].Health -= 3;
                    playerAMana -= 6;
                } else {
                    playerBChampion[0].Health -= 6;
                    playerAMana -= 6;
                }

                if (playerBChampion[0].Health <= 0) {
                    //end game
                }

                this.setState({
                    playerBChamp: playerBChampion,
                    playerAField: playerAField,
                    playerAMana: playerBMana
                })
            }
            }
        }

        if (destination.droppableId !== "playerChampionA" && destination.droppableId !== "playerChampionB" && source.droppableId !== "fieldA" && source.droppableId !== "fieldB" && source.droppableId !== "playerHandA" && source.droppableId !== "playerHandB" ) {
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

                if (playerAMana >= 6) {

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

                    var attackingCardType = playerAField[attackingCardIndex].TypeText;
                    var defendingCardWeakness = playerBField[defendingCardIndex].WeakAgainst;
                    var defendingCardStrength = playerBField[defendingCardIndex].StrongAgainst;
                    console.log(attackingCardType);
                    console.log(defendingCardWeakness);

                    if (attackingCardType === defendingCardWeakness) {
                        playerBField[defendingCardIndex].Health -= 10;
                        playerAMana -= 6;
                    } else if (attackingCardType === defendingCardStrength) {
                        playerBField[defendingCardIndex].Health -= 3;
                        playerAField[attackingCardIndex].Health -= 3;
                        playerAMana -= 6;
                    } else {
                        playerBField[defendingCardIndex].Health -= 6;
                        playerAMana -= 6;
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
                    })


                    console.log(this.state)



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

                if (playerBMana >= 6) {

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

                    var attackingCardType = playerBField[attackingCardIndex].TypeText;
                    var defendingCardWeakness = playerAField[defendingCardIndex].WeakAgainst;
                    var defendingCardStrength = playerAField[defendingCardIndex].StrongAgainst;
                    console.log(attackingCardType);
                    console.log(defendingCardWeakness);

                    if (attackingCardType === defendingCardWeakness) {
                        playerAField[defendingCardIndex].Health -= 10;
                        playerBMana -= 6;
                    } else if (attackingCardType === defendingCardStrength) {
                        playerAField[defendingCardIndex].Health -= 3;
                        playerBField[attackingCardIndex].Health -= 3;
                        playerBMana -= 6;
                    } else {
                        playerAField[defendingCardIndex].Health -= 6;
                        playerBMana -= 6;
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
                    })


                    console.log(this.state)



                }
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

                            <div className="endTurnA">
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

                            <div className="endTurnB">
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