import React, { Component } from "react";
import championList from "./champions"
import "./DraftChampion.css"

class DraftChamp extends Component {
  state = {
    champions: championList.championList,
    player1champion: [],
    player2champion: []
  }

  selectChampion = index => {
    let selectedChampion = [...this.state.champions]
    this.setState({
      player1Champion: [...this.state.player1Champion, selectedChampion[index]]
    })
    console.log(this.state.player1Champion)
  }

  render() {
    return(
    this.state.champions.map((champion) => (
        <div className= "championCard" id= {champion.id} key={champion.id} onClick={() => this.selectChampion(champion.id)}>

        <h3 className="championName">{champion.name || "champion"}</h3>
        <p className="championHealth">{champion.Health || 2}</p>

        <p className="championCost">{champion.playCost || 6}</p>
        <img className="championWeakness" src={champion.WeakAgainst} alt="" width="42" height="1"></img>
        <img className="championStrength" src={champion.StrongAgainst} alt="" width="5" height="1"></img>
        <img className= "championPortrait" src={champion.Img} alt=""></img>
      </div> 
    )
    )
    )
    }
}
  export default DraftChamp;