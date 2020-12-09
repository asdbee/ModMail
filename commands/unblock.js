const mail = require('../modmail.js').get
const config = require('../config.js')
module.exports = {
    name: 'unblock',
    description: "Unblocks a user.",
    usage: '{prefix}unblock [id]',
    shortHands: [''],
    execute(bot,msg,args,checkMail){
        if (args[1] === undefined){
            mail.configBan('fromChannel',msg.channel.id,false)
            bot.createMessage(msg.channel.id,'`✔` Unblocked'+msg.channel.guild.members.get(checkMail.userID).username)
        }
        else if (args[1] !== undefined){
            configBan('fromUser',args[1].replace(/[\\<>@#&!]/g, ""),false)
            bot.createMessage(msg.channel.id,'`✔` Unblocked'+msg.channel.guild.members.get(args[1].replace(/[\\<>@#&!]/g, "")).username)
        }
    }
}