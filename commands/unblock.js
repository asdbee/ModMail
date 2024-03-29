const mail = require('../modmail.js').get;
module.exports = {
  name: 'unblock',
  description: 'Unblocks a user.',
  usage: '{prefix}unblock [id]',
  shortHands: [''],
  execute(client, msg, args, checkMail) {
    if (args[1] === undefined) {
      mail.configBan('fromChannel', msg.channel.id, false);
      client.createMessage(msg.channel.id, '`✔` Unblocked user');
    } else if (args[1] !== undefined) {
      mail.configBan('fromUser', args[1].replace(/[\\<>@#&!]/g, ''), false);
      client.createMessage(msg.channel.id, '`✔` Unblocked user');
    }
  },
};
