const config = require('./config.js');
module.exports = (bot,currentMail) => {
    bot.on('messageCreate', (msg) => {
        if (msg.author.bot) return;
        if (msg.guildID === undefined) return;
        if (!msg.content.startsWith(config.prefix)) return;
        const args = msg.content.slice(config.prefix.length).trim().split(' ')
        const checkMail = currentMail.find(p => p.cID === msg.channel.id)

        if (args[0] === 'r'){
            const fullU = msg.author.username+'#'+msg.author.discriminator
            if (checkMail === undefined) return bot.createMessage(msg.channel.id,'`!` There is no ModMail affiliated with this channel.')
            if (args[1] === undefined) return;
            const content = msg.content.slice(config.prefix.length+2)
            bot.getDMChannel(checkMail.userID).then((bot) => bot.createMessage('**'+fullU+'**: '+content)).then(
                bot.createMessage(msg.channel.id,'(Staff) **'+fullU+'**: '+content),
                msg.delete()
            )
        }

        if (args[0] === 'ar'){
            const fullU = msg.author.username+'#'+msg.author.discriminator
            if (checkMail === undefined) return bot.createMessage(msg.channel.id,'`!` There is no ModMail affiliated with this channel.')
            if (args[1] === undefined) return;
            const content = msg.content.slice(config.prefix.length+3)
            bot.getDMChannel(checkMail.userID).then((bot) => bot.createMessage('**Staff**: '+content)).then(
                bot.createMessage(msg.channel.id,'(ANNON) **'+fullU+'**: '+content),
                msg.delete()
            )
        }

        if (args[0] === 'close'){
            if (checkMail === undefined) return bot.createMessage(msg.channel.id,'`!` There is no ModMail affiliated with this channel.')
            checkMail.closed = true
            bot.getDMChannel(checkMail.userID).then((bot) => bot.createMessage('**ModMail Notification**: Your ModMail has been closed. Reply to create a new one.')).then(
                bot.createMessage(config.logChannel,{embed:{
                    title: 'ModMail Closed',
                    fields: [
                        {
                            name: 'ModMail',
                            value: msg.channel.name+'\n(`'+msg.channel.id+'`)',
                            inline: true
                        },
                        {
                            name: 'Details',
                            value: 'Moderator: '+msg.author.mention+'\n('+msg.author.username+'#'+msg.author.discriminator+')',
                            inline: true
                        }
                    ],
                    color: config.color
                }}).then(
                msg.channel.delete()
                )
            )
        }

    })
}