import React, { Component } from "react";
import championList from "./champions"
import "./DraftChampion.css";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
* Moves an item from one list to another list.
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
  state = {
    champions: championList.championList,
    player1champion: [],
    player2champion: []
  }

  id2List = {
    droppable: 'champions'
    // droppable2: 'player1champion'
  };

  getList = id => this.state[this.id2List[id]];

  onDragEnd = result => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index
      );

      let state = { items };

      // if (source.droppableId === 'droppable2') {
      //   state = { selected: items };
      // }

      this.setState(state);
    } else {
      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      );

      this.setState({
        items: result.droppable,
        // selected: result.droppable2
      });
    }
  };

  // selectChampion = index => {
  //   let selectedChampion = [...this.state.champions]
  //   this.setState({
  //     player1Champion: [...this.state.player1Champion, selectedChampion[index]]
  //   })
  //   console.log(this.state.player1Champion)
  // }

  render() {
    return (

      <div className="container">
        <div className="championHeader">
          <h1>Choose a champion</h1>
        </div>
        <div className="row2">
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div className="dragabbleArea">
                <div className="championContainer" ref={provided.innerRef}>

                  {this.state.champions.map((champion) => (
                    <Draggable
                      key={champion.id}
                      draggableId={champion.id}
                      index={champion.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="championCard" id={champion.id} key={champion.id}>

                          <h3 className="championName">{champion.name || "champion"}</h3>
                          <p className="championHealth">{champion.Health || 2}</p>

                          <p className="championCost">{champion.playCost || 6}</p>
                          <img className="championWeakness" src={champion.WeakAgainst} alt="" width="42" height="1"></img>
                          <img className="championStrength" src={champion.StrongAgainst} alt="" width="5" height="1"></img>
                          <img className="championPortrait" src={champion.Img} alt=""></img>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
                <div className = "chosenChampion">
                </div>
                </div>

              )
              }


            </Droppable>
          </DragDropContext>
        </div>
      </div>
    )
  }
}
export default DraftChamp;