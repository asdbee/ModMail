const mail = require('../modmail.js').get
const config = require('../config.js')
const fs = require('fs')
const path = require('path')
module.exports = {
    name: 're',
    description: "Replies with a snippet.",
    usage: '{prefix}re [reply name]',
    shortHands: [''],
    execute(bot,msg,args,checkMail){
        if (checkMail === null) return bot.createMessage(msg.channel.id,'`!` There is no ModMail affiliated with this channel.')

        const get = path.join(__dirname, '../replies/'+args[1]+'.json');
        const c = fs.readFileSync(get)
        const fullU = msg.author.username+'#'+msg.author.discriminator
        if (JSON.parse(c.toString()).annon === false){
        bot.getDMChannel(checkMail.userID).then((bot) => bot.createMessage(config.msgPrefix+' **'+fullU+'**: '+JSON.parse(c.toString()).reply)).then(
            bot.createMessage(msg.channel.id,config.msgPrefix+' **'+fullU+'**: '+JSON.parse(c.toString()).reply),
            msg.delete()
        )}
        
        if (JSON.parse(c.toString()).annon === true){
            bot.getDMChannel(checkMail.userID).then((bot) => bot.createMessage('**'+config.msgPrefix+'**: '+JSON.parse(c.toString()).reply)).then(
                bot.createMessage(msg.channel.id,'(Annon) **'+fullU+'**: '+JSON.parse(c.toString()).reply),
                msg.delete()
        )}
    }
}