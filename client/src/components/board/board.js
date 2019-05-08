import React, { Component } from "react";
import "./board.css";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


class GameBoard extends Component {
  state = {

  }


  render() {
    return (
        <div className="outerContainer">

               
            <div className="containerA">

                <div className="rowA">
                    <div className="championA">

                    </div>
                    <div className="playerHandA">

                    </div>
                </div>

                <div className="fieldA">

                </div>
            </div>



            <div className="containerB">

                <div className="fieldB">

                </div>

                <div className="rowB">
                    <div className="championB">

                    </div>
                    <div className="playerHandB">

                    </div>
                </div>
            </div>

        </div>
    )
  }
}
export default GameBoard;