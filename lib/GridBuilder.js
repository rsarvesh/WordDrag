const _ = require('underscore');
const words = require('./WordsList.json');

let chosenWords = [];

function getConfigs(grid, size) {
    let configs = {};

    let wordIndex = _.random(0, words.length - 1);
    while(_.indexOf(chosenWords, words[wordIndex]) !== -1) {
        wordIndex = _.random(0, words.length);
    }
    chosenWords.push(words[wordIndex].toUpperCase());
    configs.word = words[wordIndex].toUpperCase();

    let randomPerc = _.random(1, 100);
    configs.orientation = (randomPerc <= 40 ? 'horizontal' : (randomPerc <= 80 ? 'vertical' : 'vertical'));

    let isValidRowCol = false;
    let loopCount = 0;

    while(!isValidRowCol) {
        configs.startRow = configs.orientation === 'vertical' ? _.random(0, size - configs.word.length - 1) : _.random(0, size - 1);
        configs.startColumn = configs.orientation === 'horizontal' ? _.random(0, size - configs.word.length - 1) : _.random(0, size - 1);
        isValidRowCol = true;
        if(configs.orientation === 'horizontal') {
            configs.word.split('').forEach((char, ind) => {
                if(ind === 0 && configs.startColumn - 1 >= 0 && grid[configs.startRow][configs.startColumn - 1] !== "")
                    isValidRowCol = false;
                if(ind === configs.word.length - 1 && configs.startColumn + ind + 1 <= size && grid[configs.startRow][configs.startColumn + ind + 1] !== "")
                    isValidRowCol = false;
                if(grid[configs.startRow][configs.startColumn + ind] !== "")
                    isValidRowCol = false;
            })
        }
        if(configs.orientation === 'vertical') {
            configs.word.split('').forEach((char, ind) => {
                if(ind === 0 && configs.startRow - 1 >= 0 && grid[configs.startRow - 1][configs.startColumn] !== "")
                    isValidRowCol = false;
                if(ind === configs.word.length - 1 && configs.startRow + ind + 1 <= size && grid[configs.startRow + ind + 1][configs.startColumn] !== "")
                    isValidRowCol = false;
                if(grid[configs.startRow + ind][configs.startColumn] !== "")
                    isValidRowCol = false;
            })
        }

        if(loopCount >= 100) {
            // generateGrid(size);
            return {"error": "loop count exceeded"};
        }
        loopCount++;
    }

    return configs;
}

function generateGrid(size) {
    let grid = [];

    for(let i=0;i<size;i++) {
        grid.push(_.range(size).map(() => {return ""}))
    }

    for(let i=0;i<25;i++) {
        let configs = getConfigs(grid, size);
        console.log(configs);

        if(configs.error) {
            console.log("genertaing new grid");
            return generateGrid(size);
        }

        if(configs.orientation === 'horizontal') {
            configs.word.split('').forEach((char, ind) => {
                grid[configs.startRow][configs.startColumn + ind] = char;
            })
        }
        if(configs.orientation === 'vertical') {
            configs.word.split('').forEach((char, ind) => {
                grid[configs.startRow + ind][configs.startColumn] = char;
            })
        }
    }

    let prevLetter = ''
    for(let i=0;i<size;i++) {
        for(let j=0;j<size;j++) {
            if(grid[i][j] === '') {
                grid[i][j] = (String.fromCharCode('A'.charCodeAt() + _.random(0, 25)));
                if(prevLetter === grid[i][j])
                    grid[i][j] = (String.fromCharCode('A'.charCodeAt() + _.random(0, 25)));
            }
            prevLetter = grid[i][j];
        }
    }

    console.log(JSON.stringify(grid));
    return grid;
}

module.exports = {
    generateGrid
}