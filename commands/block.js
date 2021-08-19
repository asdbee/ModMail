const mail = require('../modmail.js').get;
module.exports = {
  name: 'block',
  description: 'Blocks a user from using ModMail.',
  usage: '{prefix}block [id]',
  shortHands: [''],
  execute(client, msg, args, checkMail) {
    if (args[1] === undefined) {
      mail.configBan('fromChannel', msg.channel.id, true);
      client.createMessage(msg.channel.id, '`✔` Blocked user');
    } else if (args[1] !== undefined) {
      mail.configBan('fromUser', args[1].replace(/[\\<>@#&!]/g, ''), true);
      client.createMessage(msg.channel.id, '`✔` Blocked user');
    }
  },
};
