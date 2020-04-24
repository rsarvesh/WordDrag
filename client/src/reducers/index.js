import { combineReducers } from 'redux';

const initialState = {
  baseUrl: "",
  error: null,
  grid: [],
  game: {},
  gameName: "",
  gameId: "",
  players: [],
  curPlayerName: "",
  gameStarted: false,
  playerWords: []
};

function worddrag(state = initialState, action) {
  switch (action.type) {
    case "UPDATE_GAME":
      return {
        ...state,
        game: action.payload,
        error: action.payload.error ? action.payload.error : null,
        gameId: action.payload._id,
        grid: action.payload.grid ? action.payload.grid : [],
        gameName: action.payload.name ? action.payload.name : "",
        players: action.payload.players ? action.payload.players : [],
        gameStarted: action.payload.gameStarted ? action.payload.gameStarted : false
      }
    case "UPDATE_GRID":
      return {
        ...state,
        grid: action.payload
      }
    case "UPDATE_CURRENT_PLAYER":
      return {
        ...state,
        curPlayerName: action.payload
      }
    case "UPDATE_PLAYER_WORDS":
      return {
        ...state,
        playerWords: action.payload
      }
    case "UPDATE_BASE_URL":
      return {
        ...state,
        baseUrl: action.payload
      }
    default:
      return state;
  }
}

export default combineReducers({
  worddrag
});
