import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as _ from 'underscore';
import './WordDrag.less';
import {updateCurrentPlayerScore, getGameDetails, updateCurrentPlayerWords} from '../actions'
import Scorecard from './Scorecard';
import Grid from './Grid';

export class WordDrag extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.storePlayerWords = this.storePlayerWords.bind(this);

    this.timer = 120;
  }

  componentDidMount() {
    setInterval(() => {
      this.props.getGameDetails(this.props.gameId);
      this.timer--;
    }, 1000)
  }

  storePlayerWords() {
    let {gameId, players, curPlayerName, playerWords} = this.props;
    let playerInd = _.findIndex(players, {
      playerName: curPlayerName
    })

    this.props.updateCurrentPlayerWords(gameId, players[playerInd], playerWords);
  }

  render() {
    const {grid, gameName, curPlayerName, players, playerWords} = this.props;
    let playerInd = _.findIndex(players, {
      playerName: curPlayerName
    })
    let score = playerInd !== -1 ? players[playerInd].playerScore : -1;
    let sortedPlayers = _.sortBy(players, function(player){ return -1*player.playerScore });

    if(this.timer === 0) {
      this.storePlayerWords();
    }

    return (
      this.timer && this.timer < 0 ? 
      <Scorecard /> :
      <div id="worddrag">
        <h1>Word Drag</h1>
        <h3>Game Name: {gameName}</h3>
        <h3>Player Name: {curPlayerName}</h3>
        <h4>Score: {score}</h4>
        {
          grid && grid.length > 0 && 
          <Grid grid={grid} storeScore={true} />
        }
        {
          playerWords.length > 0 &&
          <div className="words-list">
            <p>
              <b>Words:&nbsp;</b>
              {playerWords.length && playerWords.map((word, ind) => {
                if(ind === playerWords.length - 1)
                  return word;
                return word + ", "
              })}
            </p>
          </div>
        }
        <div className="scorecard">
          <h3>Scorecard</h3>
          <ul>
          {
            sortedPlayers.length > 0 &&
            sortedPlayers.map((player) => {
              return <li>{player.playerName} - {player.playerScore}</li>
            })
          }
          </ul>
        </div>
        <div className="time-left">
          <h3>Time remaining: {this.timer}s</h3>
        </div>
      </div>
    );
  }
  
}

function mapStateToProps(state) {
  return {
    grid: state.worddrag.grid,
    gameId: state.worddrag.gameId,
    gameName: state.worddrag.gameName,
    curPlayerName: state.worddrag.curPlayerName,
    players: state.worddrag.players,
    playerWords: state.worddrag.playerWords
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateCurrentPlayerScore,
    getGameDetails,
    updateCurrentPlayerWords
  },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WordDrag);
