const mail = require('./database/template.js')
const fs = require('fs')
const path = require('path')
module.exports = (bot) => {
function updateLog(channel,author,message){
    fs.appendFile(path.join(__dirname, '/logs/'+channel+'.txt'), `${author.username}#${author.discriminator}: ${message}\n`, function (err) {
    if (err) {
      console.error('UNABLE TO LOG TO TRANSCRIPT')
    } else {}
  })
  }

  bot.on('messageCreate', (msg) => {
    mail.findOne({channelID: msg.channel.id}).then((data) => {
        if (data === null) return;
        updateLog(msg.channel.id,msg.author,msg.content)
    })
  })
}