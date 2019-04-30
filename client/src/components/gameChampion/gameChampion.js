import React from "react";

function gameChamp(props) {
    return <div>
        <h3 className="champName">{props.name}</h3>
        <p className="champHealth">{props.health}</p>
        <p className="champattack1">{props.attack1}</p>
        <p className="champattack1cost">{props.attack1cost}</p>
        <p className="champattack2">{props.attack2}</p>
        <p className="champattack2cost">{props.attack2cost}</p>
        <p className="weakness">{props.weakness}</p>
        <p className="stength">{props.strength}</p>
        <img className= "champImage" src={props.image}></img>
    </div>
  }

  export default gameChamp;