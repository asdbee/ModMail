const fs = require('fs')
const Eris = require('eris');
const axios = require('axios');
const moment = require('moment')
const config = require('./config.js');
const bot = new Eris(config.token, {defaultImageFormat: 'png'});
const currentMail = []
require('./commandHandler.js')(bot,currentMail)

bot.on('ready', () => {
      console.log('ONLINE ON '+bot.shards.size+' SHARDS')
      console.log('Bot updated successfully ('+moment(bot.startTime).format("lll")+')');
    bot.editStatus('online', { name: config.status, type: 0})

    // This below ensure the bot runs smoothly.
    if (!bot.guilds.get(config.mainGuild)){console.error('Main guild must be a valid guild.'), process.exit()}
    if (!bot.guilds.get(config.mainGuild).channels.get(config.logChannel)){console.error('Log channel must be in main guild.'), process.exit()}
    if (!bot.guilds.get(config.mainGuild).channels.get(config.mailChannel)){console.error('Mail channel must be in main guild.'), process.exit()}
    if (!bot.guilds.get(config.mainGuild).roles.get(config.modRole)){console.error('Mod role must be in main guild.'), process.exit()}
})

bot.on("guildCreate", (guild) => {
  if (guild.id !== config.mainGuild){
    bot.guilds.get(guild.id).leave()
  }
})

bot.on("error", (err) => {
    console.log(err)
    if (err.toString().startsWith('Error: Connection reset by peer') || err.toString().startsWith('Error: 1001:')) return;
    bot.createMessage('717822384198910042',{ embed: {
      title: 'ERROR',
      description: '```js\n'+err.stack+'\n```',
      }});
  });

  bot.on('messageCreate', (msg) => {
    if (msg.author.bot) return;
    if (!bot.guilds.get(config.mainGuild).members.get(msg.author.id)) return;
    if (msg.guildID === undefined){
      const checkMail = currentMail.find(p => p.userID === msg.author.id)
      const fullU = msg.author.username+'#'+msg.author.discriminator
      let att = ''
      console.log(msg.attachments)
      if (msg.attachments[0] !== undefined){att = msg.attachments[0].filename+'\n'+msg.attachments[0].url}
      else if (msg.attachments[0] === undefined){att = ''}
      console.log(att)

      if (checkMail === undefined){
      bot.createChannel(config.mainGuild,msg.author.username+' '+msg.author.discriminator,0).then(async (newMail) => {
        await currentMail.push({userID: msg.author.id, closed: false, cID: newMail.id})
        await newMail.edit({parentID: config.mailChannel})
        await newMail.editPermission(config.mainGuild,'0','1024','role','@everyone view denied.')
        await newMail.editPermission(config.modRole,'52224','8192','role','ModRole view allowed.')
        await bot.createMessage(newMail.id,'New ModMail\n—————————————————\n**Account Information**\n\nCreation Date: '+moment(msg.author.createdAt).format("lll")+'\nJoined Server: '+moment(msg.author.joinedAt).format("lll")+'\n\n**'+fullU+'**: '+msg.content+'\n'+att)
      })
  }
  else if (checkMail !== undefined){
    if (checkMail.closed === true){
      bot.createChannel(config.mainGuild,msg.author.username+' '+msg.author.discriminator,0).then(async (newMail) => {
        await currentMail.push({userID: msg.author.id, closed: false, cID: newMail.id})
        await newMail.edit({parentID: config.mailChannel})
        await newMail.editPermission(config.mainGuild,'0','1024','role','@everyone view denied.')
        await newMail.editPermission(config.modRole,'52224','8192','role','ModRole view allowed.')
        await bot.createMessage(newMail.id,'New ModMail\n—————————————————\n**Account Information**\n\nCreation Date: '+moment(msg.author.createdAt).format("lll")+'\nJoined Server: '+moment(msg.author.joinedAt).format("lll")+'\n\n**'+fullU+'**: '+msg.content+'\n'+att)
      })
    }
    else if (checkMail.closed === false){
      bot.createMessage(checkMail.cID,'**'+fullU+'**: '+msg.content+'\n'+att)
    }
  }
}
})

bot.connect()