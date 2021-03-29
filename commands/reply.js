const config = require('../config.js');
module.exports = {
  name: 'reply',
  description: 'Replies to a user in a ModMail thread.',
  usage: '{prefix}reply [text]',
  shortHands: ['r'],
  execute(bot, msg, args, checkMail) {
    if (checkMail === null) return bot.createMessage(msg.channel.id, '`!` There is no ModMail affiliated with this channel.');
    let displayName = '';
    if (msg.member.nick !== null) {
      displayName = msg.member.nick;
    } else if (msg.member.nick === null) {
      displayName = msg.member.username + '#' + msg.member.discriminator;
    }
    let att = '';
    if (msg.attachments[0] !== undefined) {
      att = msg.attachments[0].url;
    } else if (msg.attachments[0] === undefined) {
      att = '';
    }
    if (args[1] === undefined) return;
    const content = msg.content.slice(config.prefix.length + args[0].length + 1);
    bot
      .getDMChannel(checkMail.userID)
      .then((bot) => bot.createMessage(config.msgPrefix + ' **' + displayName + '**: ' + content))
      .then(bot.createMessage(msg.channel.id, config.msgPrefix + ' **' + displayName + '**: ' + content + '\n' + att), msg.delete());
  },
};
