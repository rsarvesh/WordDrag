import axios from 'axios';

export function storeGameDetails(game) {
    return {
        type: "UPDATE_GAME",
        payload: game
    }
}

export function storeGrid(grid) {
    return {
        type: "UPDATE_GRID",
        payload: grid
    }
}

export function updatePlayerWords(words) {
    return {
        type: "UPDATE_PLAYER_WORDS",
        payload: words
    }
}

export function storeCurrentPlayer(playerName) {
  return {
      type: "UPDATE_CURRENT_PLAYER",
      payload: playerName
  }
}

export function createGame(size, gameName, playerName) {
  return (dispatch, getState) => {
      let { baseUrl } = getState().worddrag;
      
      let players = [{
        playerName: playerName,
        playerScore: 0,
        isAdmin: true
      }] 
      let body = {
          "size": size,
          "name": gameName,
          "players": players,
          "gameStarted": false
      }
      axios.post(`${baseUrl}/api/game`, body)
      .then(response => {
          let serviceResponse = response.data;
          if(serviceResponse.success) {
                let gameId = serviceResponse.id;
                dispatch(storeCurrentPlayer(playerName))
                dispatch(getGameDetails(gameId));
          }
          
      }).catch(error => {
          console.log("Error - ", error);
      });
  };
}

export function getGameDetails(id) {
  return (dispatch, getState) => {
      let { baseUrl } = getState().worddrag;

      axios.get(`${baseUrl}/api/game/${id}`)
      .then(response => {
          let serviceResponse = response.data;
          dispatch(storeGameDetails(serviceResponse.data));
      }).catch(error => {
          console.log("Error - ", error);
      });
  };
}

export function findGame(gameName, playerName) {
  return (dispatch, getState) => {
      let { baseUrl } = getState().worddrag;

      axios.get(`${baseUrl}/api/gameFromName/${gameName}`)
      .then(response => {
          let serviceResponse = response.data;
          let players = serviceResponse.data.players;
          players.push({playerName: playerName, playerScore: 0, isAdmin: false})
          dispatch(updatePlayer(serviceResponse.data._id, players));
          dispatch(storeCurrentPlayer(playerName))
      }).catch(error => {
          console.log("Error - ", error, typeof(error));
          dispatch(storeGameDetails({error: error}));
      });
  };
}

export function updatePlayer(id, players) {
  return (dispatch, getState) => {  
      let { baseUrl } = getState().worddrag;

      let body = {
          "players": players
      }
      axios.put(`${baseUrl}/api/game/${id}`, body)
      .then(response => {
          let serviceResponse = response.data;
          if(serviceResponse.success) {
                let gameId = serviceResponse.id;
                dispatch(getGameDetails(gameId));
          }
          
      }).catch(error => {
          console.log("Error - ", error);
      });
  };
}

export function updateCurrentPlayerScore(id, curPlayer, newScore) {
  return (dispatch, getState) => {     
      let { baseUrl } = getState().worddrag;

      let body = {
          "curPlayer": curPlayer,
          "newPlayerScore": newScore
      }
      axios.put(`${baseUrl}/api/game/${id}/updatePlayerDetails`, body)
      .then(response => {
          let serviceResponse = response.data;
          if(serviceResponse.success) {
                let gameId = serviceResponse.id;
                dispatch(getGameDetails(gameId));
          }
          
      }).catch(error => {
          console.log("Error - ", error);
      });
  };
}

export function updateCurrentPlayerWords(id, curPlayer, words) {
  return (dispatch, getState) => {     
      let { baseUrl } = getState().worddrag;

      let body = {
          "curPlayer": curPlayer,
          "words": words
      }
      axios.put(`${baseUrl}/api/game/${id}/updatePlayerDetails`, body)
      .then(response => {
          let serviceResponse = response.data;
          if(serviceResponse.success) {
                let gameId = serviceResponse.id;
                dispatch(getGameDetails(gameId));
          }
          
      }).catch(error => {
          console.log("Error - ", error);
      });
  };
}

export function startGame(id) {
  return (dispatch, getState) => {    
      let { baseUrl } = getState().worddrag;

      let body = {
          "gameStarted": true
      }
      axios.put(`${baseUrl}/api/game/${id}`, body)
      .then(response => {
          let serviceResponse = response.data;
          if(serviceResponse.success) {
                let gameId = serviceResponse.id;
                dispatch(getGameDetails(gameId));
          }
          
      }).catch(error => {
          console.log("Error - ", error);
      });
  };
}