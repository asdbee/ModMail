const path = require('path');
const fs = require('fs');
module.exports = {
  name: 'log',
  description: 'Shows the current channel log.',
  usage: '{prefix}log',
  shortHands: [''],
  execute(client, msg, args, checkMail) {
    if (checkMail === null) return client.createMessage(msg.channel.id, '`!` There is no ModMail affiliated with this channel.');
    if (args[0].toLowerCase() === 'log') {
      const file = path.join(__dirname, '../logs/' + msg.channel.id + '.txt');
      const buffer = fs.readFileSync(file);
      client.createMessage(msg.channel.id, 'Current Channel Log', {
        file: buffer,
        name: 'transcript.txt',
      });
    }
  },
};
