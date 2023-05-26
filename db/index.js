const mongoose = require('mongoose')
const url = process.env.DATABASEURL || 'mongodb://127.0.0.1:27017/worddrag';

mongoose
    .connect(url, { useNewUrlParser: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection
module.exports = db