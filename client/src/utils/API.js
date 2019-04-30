import axios from "axios";

export default {
  // Gets all minions
  getMinions: function() {
    return axios.get("/api/minions");
  },
  
};