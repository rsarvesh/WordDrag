const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Game = new Schema(
    {
        name: { type: String, required: true },
        grid: { type: [[String]], required: true },
        players: { type: [Object], required: false },
        gameStarted: { type: Boolean, required: true }
    },
    { timestamps: true },
)

module.exports = mongoose.model('games', Game)