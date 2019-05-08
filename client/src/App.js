import React, { Component } from "react";
// import logo from "./logo.svg";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import DraftMinion from "./components/draftMinion/draftMinion";
import DraftChamp from "./components/draftChamp/draftChamp";
import GameBoard from "./components/board/board"

class App extends Component {
  render() {
    return (
    //   <Router>
    //   <div>
    //     <Switch>
    //       <Route exact path="/api/minion" component={DraftMinion} />
          
    //     </Switch>
    //   </div>
    // </Router>
        <GameBoard></GameBoard>
    );
  }
}

export default App;
