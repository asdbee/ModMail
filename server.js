const fs = require('fs');
const Eris = require('eris');
const moment = require('moment');
const config = require('./config.js');
const bot = new Eris(config.token, {defaultImageFormat: 'png', getAllUsers: false, restMode: true});
require('./commandHandler.js')(bot);
require('./database/databaseHandler.js');
require('./channelLogging.js')(bot);

const mail = require('./modmail.js').get

function updateDB (id,channel,closed,log) {
  const getMail = require('./database/template.js')
  getMail.findById(id).then((data) => {
  data.channelID = channel,
  data.isClosed = closed,
  data.logFile = log
  data.save()
  })
};

bot.on('ready', () => {

      // This below ensure the bot runs smoothly.
      if (!bot.guilds.get(config.mainGuild)){console.error('Main guild must be a valid guild.'), process.exit()}
      if (!bot.guilds.get(config.mainGuild).channels.get(config.logChannel)){console.error('Log channel must be in main guild.\nProcess exited with code 1'), process.exit()}
      if (!bot.guilds.get(config.mainGuild).channels.get(config.mailChannel)){console.error('Mail channel must be in main guild.\nProcess exited with code 1'), process.exit()}
      if (bot.guilds.get(config.mainGuild).channels.get(config.mailChannel).type !== 4){console.error('Mail channel must be a category.\nProcess exited with code 1'), process.exit()}
      config.modRoles.forEach((r) => {if (!bot.guilds.get(config.mainGuild).roles.get(r)){console.error('Mod role must be in main guild. ['+r+']\nProcess exited with code 1'), process.exit()}})      
      if (config.msgPrefix.replace(/ /g, '') === ''){console.error('Add a staff message prefix!\nProcess exited with code 1'), process.exit()}
      if (config.prefix.replace(/ /g, '') === ''){console.error('Add a command prefix!\nProcess exited with code 1'), process.exit()}
  
      console.log('Bot updated successfully ('+moment(bot.startTime).format("lll")+')');
      bot.editStatus('online', { name: config.status, type: 3})
})

bot.on("guildCreate", (guild) => {
  if (guild.id !== config.mainGuild){
    bot.guilds.get(guild.id).leave()
  }
})

bot.on('channelDelete', (channel) => {
  const getMail = require('./database/template.js')
  getMail.findOne({channelID: channel.id}).then((data) => {
    if (data === null) return;
    data.isClosed = true
    data.save()
  })
})

bot.on("error", (err) => {
    console.log(err.stack)
    if (err.toString().startsWith('Error: Connection reset by peer') || err.toString().startsWith('Error: 1001:')) return;
  });

  bot.on('messageCreate', (msg) => {
    if (msg.author.bot) return;
    //if (!bot.guilds.get(config.mainGuild).members.get(msg.author.id)) return
    if (msg.guildID === undefined){
      mail.getModMail(msg.author.id).then((checkMail) => {
      
      // Messaging
      
      const fullU = msg.author.username+'#'+msg.author.discriminator
      const botName = bot.user.username // was being weird so, const

      let att = ''
      if (msg.attachments[0] !== undefined){att = msg.attachments[0].filename+'\n'+msg.attachments[0].url}
      else if (msg.attachments[0] === undefined){att = ''}

      if (checkMail === null){
      bot.createChannel(config.mainGuild,msg.author.username+' '+msg.author.discriminator,0).then(async (newMail) => {
        await mail.createDB(msg.author.id,newMail.id,false,false)
        await newMail.edit({parentID: config.mailChannel})
        await newMail.editPermission(config.mainGuild,'0','1024','role','@everyone view denied.')
        await config.modRoles.forEach((r) => {newMail.editPermission(r,'52224','8192','role','ModRole view allowed.')})        
        await newMail.editPermission(bot.user.id,'52224','0','member','ModMail app allowed.')
        bot.getRESTGuildMember(config.mainGuild, msg.author.id).then(async (userOb) => {
        await bot.createMessage(newMail.id,'New ModMail\n—————————————————\n**Account Information**\n\nCreation Date: '+moment(msg.author.createdAt).format("lll")+'\nJoined Server: '+moment(userOb.joinedAt).format("lll")+'\n\n**'+fullU+'**: '+msg.cleanContent+'\n'+att)
        await bot.getDMChannel(msg.author.id).then((bot) => bot.createMessage('`✔` Your message has been received. A team member will be with you shortly.'))
        })
      })
  }
  else if (checkMail !== null){
    if (checkMail.isBanned === true) return bot.getDMChannel(checkMail.userID).then((bot) => bot.createMessage('**ModMail Notification**: You have been blacklisted from using '+botName+'!'));
    if (checkMail.isClosed === true){
      bot.createChannel(config.mainGuild,msg.author.username+' '+msg.author.discriminator,0).then(async (newMail) => {
        await updateDB(msg.author.id,newMail.id,false,'')
        await newMail.edit({parentID: config.mailChannel})
        await newMail.editPermission(config.mainGuild,'0','1024','role','@everyone view denied.')
        await config.modRoles.forEach((r) => {newMail.editPermission(r,'52224','8192','role','ModRole view allowed.')})
        await newMail.editPermission(bot.user.id,'52224','0','member','ModMail app allowed.')
        bot.getRESTGuildMember(config.mainGuild, msg.author.id).then(async (userOb) => {
        await bot.createMessage(newMail.id,'New ModMail\n—————————————————\n**Account Information**\n\nCreation Date: '+moment(msg.author.createdAt).format("lll")+'\nJoined Server: '+moment(userOb.joinedAt).format("lll")+'\n\n**'+fullU+'**: '+msg.cleanContent+'\n'+att)
        await bot.getDMChannel(msg.author.id).then((bot) => bot.createMessage('`✔` Your message has been received. A team member will be with you shortly.'))
        })
      })
    }
    else if (checkMail.isClosed === false){
      bot.createMessage(checkMail.channelID,'**'+fullU+'**: '+msg.cleanContent+'\n'+att)
    }
  }
  })}
})

bot.connect()
