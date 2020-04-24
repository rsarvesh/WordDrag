const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const db = require('./db')
const gameRouter = require('./routes/game-router')

const app = express()
const apiPort = process.env.PORT || 4000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })

app.use('/', express.static('./public'));

app.use('/api', gameRouter)

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))