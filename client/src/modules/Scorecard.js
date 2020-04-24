import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as _ from 'underscore';
import {startGame, getGameDetails} from '../actions'
import './WordDrag.less';
import { Grid } from './Grid';

export class Scorecard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    setInterval(() => {
      this.props.getGameDetails(this.props.gameId);
    }, 1000)
  }

  render() {
    const {players, gameName, grid} = this.props;
    let sortedPlayers = _.sortBy(players, function(player){ return -1*player.playerScore });

    return (
      <div id="final-scorecard">
        <h1>Word Drag</h1>
        <h3>Game Name: {gameName}</h3>
        <div className="player-list">
          <h3>Final Scorecard: </h3>
          <ul>
          {
            sortedPlayers.length > 0 &&
            sortedPlayers.map((player) => {
                return (
                  <li>
                    <b>{player.playerName} {player.isAdmin && ` (Admin)`} - {player.playerScore}</b>
                    <br />
                    Words found:&nbsp;
                    {
                      player.playerWords && player.playerWords.length > 0 && player.playerWords.map((word, ind) => {
                        if(ind === player.playerWords.length - 1)
                          return word;
                        return word + ", "
                      })
                    }
                  </li>
                )
            })
          }
          </ul>
        </div>
        <h3 style={{"margin": "10px 0px"}}>Grid:</h3>
        {
          grid && grid.length > 0 && 
          <div style={{"marginBottom": "10px"}}>
            <Grid grid={grid} storeScore={false} />
          </div>
        }
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
)(Scorecard);
