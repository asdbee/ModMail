const mail = require('../modmail.js').get
const config = require('../config.js')
module.exports = {
    name: 'block',
    description: "Blocks a user from using ModMail.",
    usage: '{prefix}block [id]',
    shortHands: [''],
    execute(bot,msg,args,checkMail){
        if (checkMail === null) return bot.createMessage(msg.channel.id,'`!` There is no ModMail affiliated with this channel.')
        if (args[1] === undefined){
            mail.configBan('fromChannel',msg.channel.id,true)
            bot.createMessage(msg.channel.id,'`✔` Blocked '+msg.channel.guild.members.get(checkMail.userID).username)
        }
        else if (args[1] !== undefined){
            mail.configBan('fromUser',args[1].replace(/[\\<>@#&!]/g, ""),true)
            bot.createMessage(msg.channel.id,'`✔` Blocked '+msg.channel.guild.members.get(args[1].replace(/[\\<>@#&!]/g, "")).username)
        }
    }
}