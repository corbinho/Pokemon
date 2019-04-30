import React from "react";

function GameMinion(props) {
    return <div>
        <h3 className="minionName">{props.name}</h3>
        <p className="minionHealth">{props.health}</p>
        <p className="minionattack1">{props.attack1}</p>
        <p className="minionattack1cost">{props.attack1cost}</p>
        <p className="minionattack2">{props.attack2}</p>
        <p className="minionattack2cost">{props.attack2cost}</p>
        <p className="playCost">{props.playCost}</p>
        <p className="weakness">{props.weakness}</p>
        <p className="stength">{props.strength}</p>
        <img className= "minionImage" src={props.image}></img>
    </div>
  }

  export default GameMinion;