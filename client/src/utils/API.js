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
  draftChampion: (champion, cb) => {
    socket.emit('draftChampion', champion)
    // socket.on
  },
  draftMinion: (minions , minion, cb) => {
    console.log(minions)
    socket.emit('draftMinion', minions, minion)
  }
};