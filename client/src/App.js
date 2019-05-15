import React, { Component } from "react";
// import logo from "./logo.svg";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import DraftMinion from "./components/draftMinion/draftMinion";
import DraftChamp from "./components/draftChamp/draftChamp";
import GameBoard from "./components/board/board";
import { Client } from 'boardgame.io/react';
import { game } from "./Game"


class App extends Component {
  render() {
    return (
      <div>{
        <DraftMinion></DraftMinion>
      }
      </div>
    );
  }
}

export default App;
