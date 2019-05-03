import React, { Component } from "react";
import './draftMinion.css';
import API from "../../utils/API";
import minionsList from "./minions"


class DraftMinion extends Component {
    
    state = {
        minions: minionsList.minionsList
    };

    // componentDidMount() {
    //     this.loadMinions();
    //   };

    // loadMinions = () => {
    //     API.getMinions()
    //       .then(res =>
    //         this.setState({ minions: res.data})
    //       )
    //       .catch(err => console.log(err));
    //   };

    selectMinion = index => {
      
    }

    render() {
    return(
    this.state.minions.map((minion,index) => (
        <div className= "minionCard">

        <h3 className="MinionName">{minion.Name || "Minion"}</h3>
        <p className="minionHealth">{minion.Health || 2}</p>

        <div className="ability1">
        <span className="minionAttack1">{minion.Attack1Name || "Ability 1"}</span>
        <span className="minionAttack1Power"><br></br>{minion.Attack1Power}</span>
        <span className="minionAttack1Cost">{minion.Attack1Cost}</span>
        </div>

        <div className="ability2">
        <span className="minionAttack2">{minion.Attack2Name || "Ability 2"}</span>
        <span className="minionAttack2Power"><br></br>{minion.Attack2Power}</span>
        <span className="minionAttack2Cost">{minion.Attack2Cost}</span>
        </div>

        <p className="minionCost">{minion.playCost || 6}</p>
        <img className="minionWeakness" src={minion.WeakAgainstImg} alt="" width="42" height="1"></img>
        <img className="minionStrength" src={minion.StrongAgainstImg} alt="" width="5" height="1"></img>
        <img className= "minionPortrait" src={minion.Img} alt=""></img>
      </div>
    )
    )
    )
    }}

  export default DraftMinion;