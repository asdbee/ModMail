const mail = require('../modmail.js').get;
const config = require('../config.js');
module.exports = {
  name: 'annon',
  description: 'Replies to a user in a ModMail thread without your username showing..',
  usage: '{prefix}annon [text]',
  shortHands: ['ar'],
  execute(bot, msg, args, checkMail) {
    if (checkMail === null) return bot.createMessage(msg.channel.id, '`!` There is no ModMail affiliated with this channel.');
    const fullU = msg.author.username + '#' + msg.author.discriminator;
    if (args[1] === undefined) return;
    const content = msg.content.slice(config.prefix.length + args[0].length + 1);
    bot
      .getDMChannel(checkMail.userID)
      .then((bot) => bot.createMessage('**' + config.msgPrefix + '**: ' + content))
      .then(bot.createMessage(msg.channel.id, '(ANNON) **' + fullU + '**: ' + content), msg.delete());
  },
};
