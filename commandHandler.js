const Eris = require('eris');
const fs = require('fs')
const path = require('path')
const config = require('./config.js');
const mail = require('./modmail.js').get

function getModMail (id) {
    const getMail = require('./database/template.js')
    return getMail.findById(id);
  };

module.exports = (bot) => {
    bot.commands = new Eris.Collection()

bot.on('ready',() => {
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
	    const command = require(`./commands/${file}`)
        bot.commands.set(command.name, command)
        command.shortHands.forEach((s) => bot.commands.set(s, command))
    }
})
    bot.on('messageCreate', (msg) => {
        if (msg.author.bot) return;
        if (msg.guildID === undefined) return;
        if (!bot.guilds.get(config.mainGuild).members.get(msg.author.id)) return;
        if (!msg.content.startsWith(config.prefix)) return;
        mail.getChannel(msg.channel.id).then((checkMail) => {
        const args = msg.content.slice(config.prefix.length).trim().split(' ')
        const cmd = args[0].toLowerCase()
        if (!bot.commands.has(cmd)) return;
        try{
        bot.commands.get(cmd).execute(bot,msg,args,checkMail);
        }
        catch (error) {
            bot.createMessage(msg.channel.id,'`X` There was an error executing that command.')
            console.log(error.stack)
        }
    })
})
}