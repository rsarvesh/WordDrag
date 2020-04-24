import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './WordDrag.less';
import WordDrag from './WordDrag';
import WordDragCreate from './WordDragCreate';
import Lobby from './Lobby';

export class WordDragController extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {grid, gameStarted} = this.props;

    return (
      <div id="worddrag-game">
        {
          (grid && grid.length > 0) ?
          (gameStarted ? <WordDrag /> : <Lobby />) :
          <WordDragCreate />
        }
      </div>
    );
  }
  
}

function mapStateToProps(state) {
  return {
    grid: state.worddrag.grid,
    gameStarted: state.worddrag.gameStarted
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({},
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WordDragController);
