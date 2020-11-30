const mongoose  = require('mongoose')

const modMail = mongoose.Schema({
    _id: String,
    userID: String,
    channelID: String,
    logFile: String,
    isClosed: Boolean,
    isBanned: Boolean
})

module.exports = mongoose.model('ModMail', modMail)