const Game = require('../models/game-model')
const libs = require('../lib/GridBuilder');

createGame = (req, res) => {
    const size = req.body.size
    if (!size) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a size',
        })
    }
    let grid = libs.generateGrid(size);
    
    let body = {
        "name": req.body.name ? req.body.name : 'Temp',
        "grid": grid,
        "players": req.body.players && req.body.players.length > 0 ? req.body.players : [],
        "gameStarted": req.body.gameStarted ? req.body.gameStarted : false
    }

    const game = new Game(body)

    if (!game) {
        return res.status(400).json({ success: false, error: err })
    }

    game
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: game._id,
                message: 'Game created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Game not created!',
            })
        })
}

updateGame = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Game.findOne({ _id: req.params.id }, (err, game) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Game not found!',
            })
        }
        body.players ? game.players = body.players : ''
        game.gameStarted = body.gameStarted ? body.gameStarted : game.gameStarted
        game
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: game._id,
                    message: 'Game updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Game not updated!',
                })
            })
    })
}

updatePlayerDetails = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    let player = req.body.curPlayer;
    let playerName = req.body.curPlayer.playerName;
    let newPlayerScore = req.body.newPlayerScore ? req.body.newPlayerScore : null;
    let playerWords = req.body.words ? req.body.words : null;
    let updatedPlayer = player;
    newPlayerScore ? updatedPlayer.playerScore = newPlayerScore : '';
    playerWords ? updatedPlayer.playerWords = playerWords : '';
    
    let newScore = await Game.findOneAndUpdate({
        "_id": req.params.id,
        "players.playerName": playerName
      }, {
        $set: {
          "players.$": updatedPlayer
        }
      }, {
        new: true, upsert: false
      });

      if(newScore) {
        return res.status(200).json({
            success: true,
            id: newScore._id,
            message: 'Score updated!',
        })
      }
      else {
        return res.status(404).json({
            error: 'Player not found',
            message: 'Score not updated!',
        })
      }
}

deleteGame = async (req, res) => {
    await Game.findOneAndDelete({ _id: req.params.id }, (err, game) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!game) {
            return res
                .status(404)
                .json({ success: false, error: `Game not found` })
        }

        return res.status(200).json({ success: true, data: game })
    }).catch(err => console.log(err))
}

deleteAll = async (req, res) => {
    await Game.deleteMany({}, (err, game) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!game) {
            return res
                .status(404)
                .json({ success: false, error: `Game not found` })
        }

        return res.status(200).json({ success: true, data: game })
    }).catch(err => console.log(err))
}

getGameById = async (req, res) => {
    await Game.findOne({ _id: req.params.id }, (err, game) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!game) {
            return res
                .status(404)
                .json({ success: false, error: `Game not found` })
        }
        return res.status(200).json({ success: true, data: game })
    }).catch(err => console.log(err))
}

getGames = async (req, res) => {
    await Game.find({}, (err, games) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!games.length) {
            return res
                .status(404)
                .json({ success: false, error: `Game not found` })
        }
        return res.status(200).json({ success: true, data: games })
    }).catch(err => console.log(err))
}

getGameFromName = async (req, res) => {
    await Game.findOne({ name: req.params.name }, (err, game) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!game) {
            return res
                .status(404)
                .json({ success: false, error: `Game not found` })
        }
        return res.status(200).json({ success: true, data: game })
    }).catch(err => console.log(err))
}

module.exports = {
    createGame,
    updateGame,
    deleteGame,
    getGames,
    getGameById,
    getGameFromName,
    updatePlayerDetails,
    deleteAll
}