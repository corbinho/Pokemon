import React from "react";
import './draftMinion.css';


function DraftMinion(props) {
    return <div className= "minionCard">
        <h3 className="MinionName">{props.name || "Minion"}</h3>
        <p className="minionHealth">{props.health || 2}</p>
        <p className="minionAttack1">{props.attack1 || "Ability 1"}</p>
        <p className="minionAttack1Cost">{props.attack1cost}</p>
        <p className="minionAttack2">{props.attack2 || "Ability 2"}</p>
        <p className="minionAttack2Cost">{props.attack2cost}</p>
        <p className="minionCost">{props.playCost || 6}</p>
        <p className="minionWeakness">{props.weakness}</p>
        <p className="minionStrength">{props.strength}</p>
        <img className= "minionPortrait" src={props.image} alt=""></img>
    </div>
  }

  export default DraftMinion;