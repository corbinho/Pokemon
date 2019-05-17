import React, { Component } from "react";
import championList from "./champions"
import "./DraftChampion.css";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DraftMinion from "../draftMinion/draftMinion";
import io from 'socket.io-client';
const socket = io()



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

class DraftChamp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      champions: championList.championList,
      player1champion: [],
      player2champion: [],
      playerASocket: "",
      playerBSocket: ""
    }
    socket.on('receive code', (payload) => {
      this.updateCodeFromSockets(payload)
    })

    this.id2List = {
      droppable: 'champions',
      droppable2: 'player1champion',
      droppable3: 'player2champion'
    };

    socket.on('receive users', (payload) => {
      
      const ids = Object.keys(payload)
      
      this.setState({
        playerASocket: ids[0],
        playerBSocket: ids[1]
      })
      
    })

  }

  updateCodeFromSockets(payload){
    
    this.setState({
      champions: payload.newCode.champions,
      player1champion: payload.newCode.player1champion,
      player2champion: payload.newCode.player2champion,
      playerASocket: payload.newCode.playerASocket,
      playerBSocket: payload.newCode.playerBSocket
    })
  
  }

  // updateCodeFromSocketsNoA(payload){
  //   this.setState({
  //     playerBSocket: payload.newCode.playerASocket
  //   })
  // }

  componentDidMount = () => {
    
    socket.on('connect', () => {
    socket.emit('joinGame', { room: "global" })
    
    if (this.state.playerASocket === "" ){
      
      
      
      this.setState({
          playerASocket: socket.id
        })

        socket.emit('update', {
          room: 'global',
          newCode: this.state
        })
        
    } else {
      this.setState({
        playerBSocket: socket.id
      })

      socket.emit('update', {
        room: 'global',
        newCode: this.state
      })
    }
    
    
  })
  
}



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
    } if (source.droppableId === 'droppable' && destination.droppableId === "droppable2" && this.state.player1champion.length > 0) {
      console.log("already have a hero")
      return;
    }

    if (source.droppableId === 'droppable' && destination.droppableId === "droppable3" && this.state.player2champion.length > 0) {
      console.log("already have a hero")
      return;
    }
    if (source.droppableId === 'droppable' && destination.droppableId === "droppable2") {
      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      );

      this.setState({
        champions: result.droppable,
        player1champion: result.droppable2
      });
    }

    if (source.droppableId === 'droppable' && destination.droppableId === "droppable3") {
      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      );

      this.setState({
        champions: result.droppable,
        player2champion: result.droppable3
      });
    }

    if (destination.droppableId === 'droppable' && source.droppableId === "droppable3") {
      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      );

      this.setState({
        champions: result.droppable,
        player2champion: result.droppable3
      });
    }

    if (destination.droppableId === 'droppable' && source.droppableId === "droppable2") {
      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      );

      this.setState({
        champions: result.droppable,
        player1champion: result.droppable2
      });
    }

    socket.emit('update', {
      room: 'global',
      newCode: this.state
    })

  };

  render() {
    if (this.state.player1champion.length > 0 && this.state.player2champion.length > 0) {
      return (
        <DraftMinion p1champ={this.state.player1champion} p2champ={this.state.player2champion}></DraftMinion>
      )
    } else
      return (
        <DragDropContext onDragEnd={this.onDragEnd}>
          <div className="container">
            <div className="championHeader">
              <h1 className="headerText">Choose your champion</h1>
            </div>

            <div className="row2">

              <Droppable droppableId="droppable3">
                {(provided) => (

                  <div
                    ref={provided.innerRef} className="chosenChampion1">
                    <h3 className="chosenText">Chosen Champion</h3>
                    {this.state.player2champion.map((p2Champion, index) => (
                      <Draggable
                        key={p2Champion.id}
                        draggableId={p2Champion.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}

                            className="chosenChampionCard" id={p2Champion.id} key={p2Champion.id}>

                            <h3 className="championName">{p2Champion.name || "champion"}</h3>
                            <p className="championHealth">{p2Champion.Health || 2}</p>

                            <img className="championCost" src={p2Champion.type} alt="" width="42" height="42"></img>
                            <img className="championWeakness" src={p2Champion.WeakAgainst} alt="" width="42" height="1"></img>
                            <img className="championStrength" src={p2Champion.StrongAgainst} alt="" width="5" height="1"></img>
                            <img className="championPortrait" src={p2Champion.Img} alt=""></img>

                          </div>

                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>

                )}
              </Droppable>

              <Droppable droppableId="droppable">

                {(provided) => (

                  <div className="championContainer" ref={provided.innerRef}>

                    {this.state.champions.map((champion, index) => (
                      <Draggable
                        key={champion.id}
                        draggableId={champion.id}
                        index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="championCard"
                            id={champion.id}
                            key={champion.id}
                          >

                            <h3 className="championName">{champion.name || "champion"}</h3>
                            <p className="championHealth">{champion.Health || 2}</p>

                            <img className="championCost" src={champion.type} alt="" width="42" height="42"></img>
                            <img className="championWeakness" src={champion.WeakAgainst} alt="" width="42" height="1"></img>
                            <img className="championStrength" src={champion.StrongAgainst} alt="" width="5" height="1"></img>
                            <img className="championPortrait" src={champion.Img} alt=""></img>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )
                }
              </Droppable>
              <Droppable droppableId="droppable2">
                {(provided) => (

                  <div
                    ref={provided.innerRef} className="chosenChampion2">
                    <h3 className="chosenText">Chosen Champion</h3>
                    {this.state.player1champion.map((p1champion, index) => (
                      <Draggable
                        key={p1champion.id}
                        draggableId={p1champion.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}

                            className="chosenChampionCard" id={p1champion.id} key={p1champion.id}>

                            <h3 className="championName">{p1champion.name || "champion"}</h3>
                            <p className="championHealth">{p1champion.Health || 2}</p>

                            <img className="championCost" src={p1champion.type} alt="" width="42" height="42"></img>
                            <img className="championWeakness" src={p1champion.WeakAgainst} alt="" width="42" height="1"></img>
                            <img className="championStrength" src={p1champion.StrongAgainst} alt="" width="5" height="1"></img>
                            <img className="championPortrait" src={p1champion.Img} alt=""></img>

                          </div>

                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>

                )}
              </Droppable>


            </div>

          </div>
        </DragDropContext>

      )
  }
}
export default DraftChamp;