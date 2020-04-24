import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from '../lib/Store';
import { bindActionCreators } from 'redux';
import { toast } from 'react-toastify';
import * as _ from 'underscore';
import './WordDrag.less';
import dictionary from '../lib/FullDictionary.json';
import {updateCurrentPlayerScore, updatePlayerWords} from '../actions'

// let grid = [];
let scoring = {'A': 1, 'B': 3, 'C': 3, 'D': 2, 'E': 1, 'F': 4, 'G': 2, 'H': 4, 'I': 1, 'J': 8, 'K': 5, 'L': 1, 'M': 3, 'N': 1, 'O': 1, 'P': 2, 'Q': 10, 'R': 1, 'S': 1, 'T': 1, 'U': 1, 'V': 4, 'W': 4, 'X': 8, 'Y': 4, 'Z': 10}

export class Grid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dragStarted: false,
      draggedBoxes: [],
      draggedWord: '',
      dragMode: '',
      startBox: ''
    };
    this.boxClicked = this.boxClicked.bind(this);
    this.boxHovered = this.boxHovered.bind(this);
    this.renderGrid = this.renderGrid.bind(this);
    this.checkRepetition = this.checkRepetition.bind(this);
  }

  checkWord(word) {
    return _.indexOf(dictionary, word.toLowerCase()) !== -1 ? true : false;
  }

  boxClicked(ev) {
    let {draggedWord, dragStarted} = this.state;
    let {gameId, players, curPlayerName, playerWords, storeScore} = this.props;
    let playerInd = _.findIndex(players, {
      playerName: curPlayerName
    })
    let score = playerInd !== -1 ? players[playerInd].playerScore : -1;

    let boxes = this.state.draggedBoxes;
    boxes.push(ev.target.className);
    let letter = ev.target.textContent;
    let startBox = ev.target.className;
    
    if(dragStarted === true) {
      if(draggedWord.length >= 3) {
        if(_.indexOf(playerWords, draggedWord) === -1 && this.checkWord(draggedWord)) {
          toast.success("Correct word: " + draggedWord, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true
          });
          if(storeScore) {
            playerWords.push(draggedWord);
            let wordScore = 0;
            draggedWord.split('').forEach((letter) => {
                wordScore += scoring[letter.toUpperCase()];
            });
            let newScore = score + wordScore;
            this.props.updateCurrentPlayerScore(gameId, players[playerInd], newScore);
          }
        }
        else if(_.indexOf(playerWords, draggedWord) !== -1) {
          toast.warn("Word already found: " + draggedWord, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true
          });
        }
        else {
          toast.error("Incorrect word: " + draggedWord, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true
          });
        }
      }
      boxes = [];
      letter = '';
      startBox = '';
    }
    this.setState({ draggedBoxes: boxes, dragStarted: !this.state.dragStarted, draggedWord: letter, startBox: startBox });
    storeScore && store.dispatch(updatePlayerWords(playerWords));
  }

  boxHovered(ev) {
    let {dragStarted, draggedBoxes, draggedWord, startBox, mode} = this.state;
    let currRow = ev.target.className.split('-')[1], currCol = ev.target.className.split('-')[2];
    let boxes = draggedBoxes;

    if(dragStarted && ev.target.className.indexOf(" ") === -1) {
      if(startBox && startBox !== '') {
        let startRow = startBox.split('-')[1], startCol = startBox.split('-')[2];
        if(startRow === currRow)
          mode = 'horizontal';
        else if(startCol === currCol)
          mode = 'vertical';
        startBox = '';
        boxes.push(ev.target.className);
        draggedWord += ev.target.textContent;
        this.setState({ draggedBoxes: boxes, draggedWord: draggedWord, startBox: startBox, mode: mode });
        return;
      }

      let prevRow = boxes[boxes.length - 1].split('-')[1], prevCol = boxes[boxes.length - 1].split('-')[2];
      if((mode === 'horizontal' && prevRow === currRow) || (mode === 'vertical' && prevCol === currCol)) {
        let nextState = this.checkRepetition(boxes, ev.target.className, draggedWord, ev.target.textContent);
        boxes = nextState.newBoxes;
        draggedWord = nextState.newWord;
        this.setState({ draggedBoxes: boxes, draggedWord: draggedWord });
      }
      else {
        this.setState({ draggedBoxes: [], draggedWord: '', dragStarted: false });
      }
    }
  }

  checkRepetition(boxes, className, word, draggedLetter) {
    let newBoxes = boxes, newWord = word;
    if(_.indexOf(boxes, className) === -1) {
      newBoxes.push(className);
      newWord += draggedLetter;
    }
    else {
      newBoxes.pop();
      newWord = newWord.slice(0, -1); 
    }
    return {
      newBoxes: newBoxes,
      newWord: newWord
    }
  }

  renderGrid(grid) {
    const {dragStarted, draggedBoxes} = this.state;
    let gridDom = [];
    let boxSelected = false;

    for(let i=0;i<grid.length;i++) {
      for(let j=0;j<grid[i].length;j++) {
        boxSelected = (dragStarted && _.indexOf(draggedBoxes, 'box-' + (i+1) + '-' + (j+1)) > -1) ? true : false;
        gridDom.push(
          <div
            className={`grid-box box-${i+1}-${j+1} ${boxSelected && 'selected'}`}
            onClick={this.boxClicked}
            onMouseDown={this.boxClicked}
            onMouseUp={this.boxClicked}
            onMouseOver={this.boxHovered}>
              <p className={`box-${i+1}-${j+1}`}>{grid[i][j].toUpperCase()}</p>
          </div>);
      }
      gridDom.push(<br />);
    }
    return gridDom;
  }

  render() {
    const {grid} = this.props;
    
    return (
        <div className="grid noselect">
          {
            grid && grid.length > 0 && this.renderGrid(grid)
          }
        </div>
    );
  }
  
}

function mapStateToProps(state) {
  return {
    gameId: state.worddrag.gameId,
    gameName: state.worddrag.gameName,
    curPlayerName: state.worddrag.curPlayerName,
    players: state.worddrag.players,
    playerWords: state.worddrag.playerWords
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateCurrentPlayerScore
  },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Grid);
