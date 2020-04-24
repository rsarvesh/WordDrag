const express = require('express')

const GameCtrl = require('../controllers/game')

const router = express.Router()

router.post('/game', GameCtrl.createGame)
router.put('/game/:id/updatePlayerDetails', GameCtrl.updatePlayerDetails)
router.put('/game/:id', GameCtrl.updateGame)
router.delete('/game/:id', GameCtrl.deleteGame)
router.get('/game/:id', GameCtrl.getGameById)
router.get('/games', GameCtrl.getGames)
router.get('/gameFromName/:name', GameCtrl.getGameFromName)
router.delete('/games', GameCtrl.deleteAll)

module.exports = router