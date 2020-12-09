const mail = require('../modmail.js').get
const config = require('../config.js')
module.exports = {
    name: 're',
    description: "Replies with a snippet.",
    usage: '{prefix}re [reply name]',
    shortHands: [''],
    execute(bot,msg,args,checkMail){
        if (checkMail === null) return bot.createMessage(msg.channel.id,'`!` There is no ModMail affiliated with this channel.')
        const findC = fs.readdirSync(__dirname + '../replies').filter(file => file === args[1]+'.js');
        if (findC[0] === undefined) return bot.createMessage(msg.channel.id,'`!` No automated reply with that name!')
        const c = require(__dirname + `/replies/${findC[0]}`);
        console.log(c.reply)
        const fullU = msg.author.username+'#'+msg.author.discriminator
        
        if (c.annon === false){
        bot.getDMChannel(checkMail.userID).then((bot) => bot.createMessage(config.msgPrefix+' **'+fullU+'**: '+c.reply)).then(
            bot.createMessage(msg.channel.id,config.msgPrefix+' **'+fullU+'**: '+c.reply),
            msg.delete()
        )}
        
        if (c.annon === true){
            bot.getDMChannel(checkMail.userID).then((bot) => bot.createMessage('**'+config.msgPrefix+'**: '+c.reply)).then(
                bot.createMessage(msg.channel.id,'(Annon) **'+fullU+'**: '+c.reply),
                msg.delete()
        )}
    }
}