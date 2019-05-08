import React, { Component } from "react";
import "./board.css";
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
    console.log(result);
    return result;
  };

class GameBoard extends Component {
    state = {
        playerAChamp: [{
            "id": "0",
            "name": "Charizard",
            "type": "../images/fireOrb.png",
            "Health": 80,
            "WeakAgainst": "../images/waterOrb.png",
            "StrongAgainst": "../images/grassOrb.png",
            "Img": "../images/Charizard.jpg"
        }],
        playerAHand: [{
            "id": "11",
            "Name": "Moltres",
            "Type": "flying",
            "Attack1Name": "Sky Attack",
            "Attack1Power": 6,
            "Attack1Cost": 9,
            "Attack2Name": "Heat Wave",
            "Attack2Power": 9,
            "Attack2Cost": 13,
            "Health": 20,
            "WeakAgainstImg": "../images/iceOrb.png",
            "StrongAgainstImg": "../images/fightingOrb.png",
            "Img": "../images/Moltres.jpg"
        },
        {
            "id": "12",
            "Name": "Nidoqueen",
            "Type": "poison",
            "Attack1Name": "Sludge Bomb",
            "Attack1Power": 6,
            "Attack1Cost": 9,
            "Attack2Name": "Shadow Ball",
            "Attack2Power": 9,
            "Attack2Cost": 13,
            "Health": 20,
            "WeakAgainstImg": "../images/psychicOrb.png",
            "StrongAgainstImg": "../images/grassOrb.png",
            "Img": "../images/nidoqueen.jpg"
        }],
        playerAField: [],
        playerAGraveyard: [],
        playerBChamp: [{
            "id": "1",
            "name": "Blastoise",
            "type": "../images/waterOrb.png",
            "Health": 80,
            "WeakAgainst": "../images/electricOrb.png",
            "StrongAgainst": "../images/darkOrb.png",
            "Img": "../images/Blastoise.jpg"
        }],
        playerBHand: [{
            "id": "13",
            "Name": "Ninetails",
            "Type": "../images/fireOrb.png",
            "Attack1Name": "Fire Blast",
            "Attack1Power": 6,
            "Attack1Cost": 9,
            "Attack2Name": "Flamethrower",
            "Attack2Power": 9,
            "Attack2Cost": 13,
            "Health": 20,
            "WeakAgainstImg": "../images/waterOrb.png",
            "StrongAgainstImg": "../images/grassOrb.png",
            "Img": "../images/Ninetails.png"
        },
        {
            "id": "14",
            "Name": "Poliwhirl",
            "Type": "../images/waterOrb.png",
            "Attack1Name": "Hydro Pump",
            "Attack1Power": 6,
            "Attack1Cost": 9,
            "Attack2Name": "Bubble Beam",
            "Attack2Power": 9,
            "Attack2Cost": 13,
            "Health": 20,
            "WeakAgainstImg": "../images/electricOrb.png",
            "StrongAgainstImg": "../images/fireOrb.png",
            "Img": "../images/Poliwhirl.jpg"
        }],
        playerBField: [],
        playerBGraveyard: [],
    }

    id2List = {
        playerHandA: 'playerAHand',
        fieldA: 'playerAField',
        playerHandB: 'playerHandB',
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
    
        if (source.droppableId === destination.droppableId) {
          const items = reorder(
            this.getList(source.droppableId),
            source.index,
            destination.index
          );
    
          let state = { items };
    
          if (source.droppableId === 'droppable2') {
            state = { selected: items };
          }
    
          this.setState(state);
        } 
        else {
          const result = move(
            this.getList(source.droppableId),
            this.getList(destination.droppableId),
            source,
            destination
          );
    
          this.setState({
            playerAField: result.fieldA,
            playerAHand: result.playerHandA,
            playerBField: result.fieldB,
            playerBHand: result.playerBHand,
          });
        }
      };

    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <div className="outerContainer">

                    <div className="containerA">

                        <div className="rowA">
                            <div className="championA">
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
                            </div>
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
                                                        className="minionHandCard"
                                                        id={minion.id}
                                                        key={minion.id}
                                                    >
                                                        <h3 className="MinionHandName">{minion.Name || "Minion"}</h3>
                                                        <p className="minionHandHealth">{minion.Health || 2}</p>

                                                        <div className="ability1">
                                                            <span className="minionHandAttack1">{minion.Attack1Name || "Ability 1"}</span>
                                                            <span className="minionHandAttack1Power"><br></br>{minion.Attack1Power}</span>
                                                            <span className="minionHandAttack1Cost">{minion.Attack1Cost}</span>
                                                        </div>

                                                        <div className="ability2">
                                                            <span className="minionHandAttack2">{minion.Attack2Name || "Ability 2"}</span>
                                                            <span className="minionHandAttack2Power"><br></br>{minion.Attack2Power}</span>
                                                            <span className="minionHandAttack2Cost">{minion.Attack2Cost}</span>
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
                                            <Draggable
                                                key={minion.id}
                                                draggableId={minion.id}
                                                index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="minionFieldCard"
                                                        id={minion.id}
                                                        key={minion.id}
                                                    >
                                                        
                                                        <p className="minionFieldHealth">{minion.Health || 2}</p>

                                                        <div className="ability1">
                                                            <span className="minionFieldAttack1">{minion.Attack1Name || "Ability 1"}</span>
                                                            <span className="minionFieldAttack1Power"><br></br>{minion.Attack1Power}</span>
                                                            <span className="minionFieldAttack1Cost">{minion.Attack1Cost}</span>
                                                        </div>

                                                        <div className="ability2">
                                                            <span className="minionFieldAttack2">{minion.Attack2Name || "Ability 2"}</span>
                                                            <span className="minionFieldAttack2Power"><br></br>{minion.Attack2Power}</span>
                                                            <span className="minionFieldAttack2Cost">{minion.Attack2Cost}</span>
                                                        </div>


                                                        <img className="minionFieldWeakness" src={minion.WeakAgainstImg} alt="" width="42" height="1"></img>
                                                        <img className="minionFieldStrength" src={minion.StrongAgainstImg} alt="" width="5" height="1"></img>
                                                        <img className="minionFieldPortrait" src={minion.Img} alt=""></img>

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


                        <div className="containerB">

                        <Droppable droppableId="fieldB">
                                {(provided) => (
                                    <div className="fieldB" ref={provided.innerRef}>
                                        {this.state.playerBField.map((minion, index) => (
                                            <Draggable
                                                key={minion.id}
                                                draggableId={minion.id}
                                                index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="minionFieldCard"
                                                        id={minion.id}
                                                        key={minion.id}
                                                    >
                                                       
                                                        <p className="minionFieldHealth">{minion.Health || 2}</p>

                                                        <div className="ability1">
                                                            <span className="minionFieldAttack1">{minion.Attack1Name || "Ability 1"}</span>
                                                            <span className="minionFieldAttack1Power"><br></br>{minion.Attack1Power}</span>
                                                            <span className="minionFieldAttack1Cost">{minion.Attack1Cost}</span>
                                                        </div>

                                                        <div className="ability2">
                                                            <span className="minionFieldAttack2">{minion.Attack2Name || "Ability 2"}</span>
                                                            <span className="minionFieldAttack2Power"><br></br>{minion.Attack2Power}</span>
                                                            <span className="minionFieldAttack2Cost">{minion.Attack2Cost}</span>
                                                        </div>


                                                        <img className="minionFieldWeakness" src={minion.WeakAgainstImg} alt="" width="42" height="1"></img>
                                                        <img className="minionFieldStrength" src={minion.StrongAgainstImg} alt="" width="5" height="1"></img>
                                                        <img className="minionFieldPortrait" src={minion.Img} alt=""></img>

                                                    </div>


                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}

                                    </div>
                                )
                                }
                            </Droppable>

                            <div className="rowB">
                                <div className="championB">
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
                                </div>
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
                                                            className="minionHandCard"
                                                            id={minion.id}
                                                            key={minion.id}
                                                        >
                                                            <h3 className="MinionHandName">{minion.Name || "Minion"}</h3>
                                                            <p className="minionHandHealth">{minion.Health || 2}</p>

                                                            <div className="ability1">
                                                                <span className="minionHandAttack1">{minion.Attack1Name || "Ability 1"}</span>
                                                                <span className="minionHandAttack1Power"><br></br>{minion.Attack1Power}</span>
                                                                <span className="minionHandAttack1Cost">{minion.Attack1Cost}</span>
                                                            </div>

                                                            <div className="ability2">
                                                                <span className="minionHandAttack2">{minion.Attack2Name || "Ability 2"}</span>
                                                                <span className="minionHandAttack2Power"><br></br>{minion.Attack2Power}</span>
                                                                <span className="minionHandAttack2Cost">{minion.Attack2Cost}</span>
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