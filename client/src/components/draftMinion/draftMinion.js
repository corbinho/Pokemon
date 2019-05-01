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
        <p className="minionAttack1">{minion.Attack1Name || "Ability 1"}</p>
        <p className="minionAttack1Cost">{minion.Attack1Cost}</p>
        <p className="minionAttack2">{minion.Attack2Name || "Ability 2"}</p>
        <p className="minionAttack2Cost">{minion.Attack2Cost}</p>
        <p className="minionCost">{minion.playCost || 6}</p>
        <p className="minionWeakness">{minion.WeakAgainst}</p>
        <p className="minionStrength">{minion.StrongAgainst}</p>
        <img className= "minionPortrait" src={minion.Img} alt=""></img>
        <button className ="selectMinion" onClick={() => this.selectMinion(index)}>Select this minion</button>
      </div>
    )
    )
    )
    }}

  export default DraftMinion;