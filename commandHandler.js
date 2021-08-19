const Eris = require('eris');
const fs = require('fs');
const config = require('./config.js');
const mail = require('./modmail.js').get;

function getModMail(id) {
  const getMail = require('./database/template.js');
  return getMail.findById(id);
}

module.exports = (client) => {
  client.commands = new Eris.Collection();

  client.on('ready', () => {
    const commandFiles = fs.readdirSync(__dirname + '/commands').filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = require(__dirname + `/commands/${file}`);
      client.commands.set(command.name, command);
      command.shortHands.forEach((s) => {
        if (s === '') return;
        client.commands.set(s, command);
      });
    }
  });
  client.on('messageCreate', (msg) => {
    if (msg.author.client) return;
    if (msg.guildID === undefined) return;
    if (!client.guilds.get(config.mainGuild).members.get(msg.author.id)) return;
    if (!msg.content.startsWith(config.prefix)) return;
    mail.getChannel(msg.channel.id).then((checkMail) => {
      const args = msg.content.slice(config.prefix.length).trim().split(' ');
      const cmd = args[0].toLowerCase();
      if (!client.commands.has(cmd)) return;
      try {
        client.commands.get(cmd).execute(client, msg, args, checkMail);
      } catch (error) {
        client.createMessage(msg.channel.id, '`X` There was an error executing that command.');
        console.log(error.stack);
      }
    });
  });
};
