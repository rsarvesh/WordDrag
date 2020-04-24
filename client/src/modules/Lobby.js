import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as _ from 'underscore';
import {startGame, getGameDetails} from '../actions'
import './WordDrag.less';
import { Grid } from './Grid';

export class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.startGame = this.startGame.bind(this);

    this.sampleGrid = []
  }

  componentDidMount() {
    this.sampleGrid = [
      ['.', 'S', '.', '.', '.'],
      ['.', 'W', 'E', 'R', 'E'],
      ['.', 'O', '.', 'A', '.'],
      ['D', 'R', 'A', 'G', '.'],
      ['.', 'D', '.', 'E', '.']
    ]
    this.sampleGrid.forEach((line) => {
      line.forEach((char, ind) => {
        if(char === '.') {
          line[ind] = (String.fromCharCode('A'.charCodeAt() + _.random(0, 25)));
        }
      })
    })
    setInterval(() => {
      this.props.getGameDetails(this.props.gameId);
    }, 1000)
  }

  startGame() {
    this.props.startGame(this.props.gameId);
  }

  render() {
    const {players, gameName, curPlayerName} = this.props;
    let playerInd = _.findIndex(players, {
      playerName: curPlayerName
    })

    return (
      <div id="lobby">
        <h1>Word Drag</h1>
        <h3>Game Name: {gameName}</h3>
        <div className="player-list">
          <h3>Players joined: </h3>
          <ul>
          {
            players.length > 0 &&
            players.map((player) => {
              return <li>{player.playerName} {player.isAdmin && ` (Admin)`}</li>
            })
          }
          </ul>
        </div>
        {
          players[playerInd].isAdmin === true
          ? <button onClick={this.startGame}>Start Game</button>
          : <h3>Wait for admin to start the game!</h3>
        }
        <hr />
        <div className="col-md-12 instructions">
          <div className="col-md-7 left">
            <h3>How to play: </h3>
            <ul>
              <li>Once game starts, a <b>20x20</b> grid of letters will be displayed</li>
              <li>Drag the letters to find words</li>
              <li>There are 2 ways to drag letters to form words:
                <ul style={{marginLeft: "10px"}}>
                  <li>Start dragging from first letter and stop at last letter</li>
                  <li>Click on first letter, move the cursor to last letter and click on last letter (recommended)</li>
                </ul>
                Try it on the sample grid on the right
              </li>
              <li><a href='https://en.wikipedia.org/wiki/Scrabble_letter_distributions' target='_blank'>Scrabble letter scores</a> will be used for calculating the score for each word found</li>
              <li>Try to score the maximum points in <b>120 seconds</b>!!</li>
            </ul>
          </div>
          <div className="col-md-5 right">
            <h3>Sample grid: </h3>
            {
              this.sampleGrid && this.sampleGrid.length > 0 && 
              <div style={{"margin": "10px auto"}}>
                <Grid grid={this.sampleGrid} storeScore={false} />
              </div>
            }
          </div>
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
    players: state.worddrag.players
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    startGame,
    getGameDetails
  },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Lobby);
