const config = require('../config.js')
const mongoose = require('mongoose')
mongoose.connect(config.databaseToken, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(console.log('Database Connected'))
