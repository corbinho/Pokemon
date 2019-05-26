import axios from "axios";
import openSocket from 'socket.io-client';

const socket = openSocket(window.location.origin);

export default {
  // Gets all minions
  getMinions: function() {
    return axios.get("/api/minions");
  },

  // Socket stuff below
  joinGame: (cb) => {
    socket.emit('joinGame', { })
    socket.on('updateGame', cb)
  },
  draftChampion: (champions, champion, cb) => {
    socket.emit('draftChampion', champions, champion)
    // socket.on
  },
  draftMinion: (minions , minion, cb) => {
  
    socket.emit('draftMinion', minions, minion)
  },

  board: (allState) => {
    console.log(allState)
    socket.emit('board', allState)
  },

  checkSocket: (cb) => {
    socket.emit('checkSocket', cb)
  },

  changeAsTurn: (currentAMaxMana, newMana) => {
    socket.emit('changeATurn', currentAMaxMana, newMana)
  },

  changeBsTurn: (currentBMaxMana, newMana) => {
    socket.emit('changeBTurn', currentBMaxMana, newMana)
  }



};