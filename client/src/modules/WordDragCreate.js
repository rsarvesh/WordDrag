import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './WordDrag.less';
import {createGame, findGame} from '../actions'

export class WordDragCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  createGame(size) {
    let gameName = document.querySelector('#create-game-name').value
    let playerName = document.querySelector('#create-game-player').value
    this.props.createGame(size, gameName, playerName);
  }

  joinGame() {
    let gameName = document.querySelector('#join-game-name').value
    let playerName = document.querySelector('#join-game-player').value
    this.props.findGame(gameName, playerName);
  }

  render() {
    let {error} = this.props;

    return (
      <React.Fragment>
        <h1>Word Drag</h1>
        <div id="create-game">
          <h3>Create Game</h3>
          Enter game name: <input id="create-game-name"></input>
          <br />Enter player name: <input id="create-game-player"></input>
          <br />
          <button onClick={() => this.createGame(20)}>Create Game</button>
        </div>
        <br />
        <br />
        <div id="join-game">
          <h3>Join Game</h3>
          Enter game name: <input id="join-game-name"></input>
          <br />Enter player name: <input id="join-game-player"></input>
          <br />
          <button onClick={() => this.joinGame()}>Join Game</button>
        </div>
        {
          error &&
          <div id="game-error">
            <p style={{"color": "red"}}>Game Not Found!</p>
          </div>
        }
        {/* <form className="col-md-12">
          <div class="form-group">
            <label for="exampleInputEmail1">Email address</label>
            <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
            <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
          </div>
          <div class="form-group">
            <label for="exampleInputPassword1">Password</label>
            <input type="password" class="form-control" id="exampleInputPassword1" />
          </div>
          <div class="form-group form-check">
            <input type="checkbox" class="form-check-input" id="exampleCheck1" />
            <label class="form-check-label" for="exampleCheck1">Check me out</label>
          </div>
          <button type="submit" class="btn btn-primary">Submit</button>
        </form> */}
      </React.Fragment>
    );
  }
  
}

function mapStateToProps(state) {
  return {
    error: state.worddrag.error
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    createGame,
    findGame
  },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WordDragCreate);
