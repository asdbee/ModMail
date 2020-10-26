const fs = require('fs')
const config = require('./config.js');

function getModMail (id) {
    const getMail = require('./database/template.js')
    return getMail.findById(id);
  };

  function getChannel (cid) {
    const getMail = require('./database/template.js')
    return getMail.findOne({channelID: cid});
  };

  function updateDB (channel,closed,banned) {
    const getMail = require('./database/template.js')
    getMail.findOne({channelID: channel}).then((data) => {
    data.channelID = channel,
    data.isClosed = closed,
    data.isBanned = banned
    data.save()
    })
  };

module.exports = (bot) => {
    bot.on('messageCreate', (msg) => {
        if (msg.author.bot) return;
        if (msg.guildID === undefined) return;
        if (!msg.content.startsWith(config.prefix)) return;
        getChannel(msg.channel.id).then((checkMail) => {

        const args = msg.content.slice(config.prefix.length).trim().split(' ')

        if (args[0] === 'r' || args[0] === 'reply'){
            const fullU = msg.author.username+'#'+msg.author.discriminator
            if (checkMail === null) return bot.createMessage(msg.channel.id,'`!` There is no ModMail affiliated with this channel.')
            if (args[1] === undefined) return;
            const content = msg.content.slice(config.prefix.length+args[0].length+1)
            bot.getDMChannel(checkMail.userID).then((bot) => bot.createMessage(config.msgPrefix+' **'+fullU+'**: '+content)).then(
                bot.createMessage(msg.channel.id,config.msgPrefix+' **'+fullU+'**: '+content),
                msg.delete()
            )
        }

        if (args[0] === 'ar' || args[0] === 'annon'){
            const fullU = msg.author.username+'#'+msg.author.discriminator
            if (checkMail === null) return bot.createMessage(msg.channel.id,'`!` There is no ModMail affiliated with this channel.')
            if (args[1] === undefined) return;
            const content = msg.content.slice(config.prefix.length+args[0].length+1)
            bot.getDMChannel(checkMail.userID).then((bot) => bot.createMessage('**'+config.msgPrefix+'**: '+content)).then(
                bot.createMessage(msg.channel.id,'(ANNON) **'+fullU+'**: '+content),
                msg.delete()
            )
        }

        if (args[0] === 'close'){
            if (checkMail === null) return bot.createMessage(msg.channel.id,'`!` There is no ModMail affiliated with this channel.')
            if (args[1] === undefined){
            updateDB(msg.channel.id,true,false)
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
            )}
            else if (args[1] === 'silent'){
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
            }
            else if (args[1] === 'with'){
                const getW = (msg.content.slice(config.prefix.length+args[0].length+args[1].length+2))
                bot.getDMChannel(checkMail.userID).then((bot) => bot.createMessage('**ModMail Notification**: Your ModMail has been closed. '+getW)).then(
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
                ))
            }
        }

        if (args[0] === 're'){
            if (checkMail === null) return bot.createMessage(msg.channel.id,'`!` There is no ModMail affiliated with this channel.')
            const findC = fs.readdirSync(__dirname + '/replies').filter(file => file === args[1]+'.js');
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

    })
})
}