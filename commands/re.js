const config = require('../config.js');
const path = require('path');
module.exports = {
  name: 're',
  description: 'Replies with a snippet.',
  usage: '{prefix}re [reply name]',
  shortHands: [''],
  execute(bot, msg, args, checkMail) {
    if (checkMail === null) return bot.createMessage(msg.channel.id, '`!` There is no ModMail affiliated with this channel.');

    const get = path.join(__dirname, '../replies/' + args[1] + '.json');
    const c = require(get);
    const fullU = msg.author.username + '#' + msg.author.discriminator;
    if (c.annon === false) {
      bot
        .getDMChannel(checkMail.userID)
        .then((bot) => bot.createMessage(config.msgPrefix + ' **' + fullU + '**: ' + c.reply))
        .then(bot.createMessage(msg.channel.id, config.msgPrefix + ' **' + fullU + '**: ' + c.reply), msg.delete());
    }

    if (c.annon === true) {
      bot
        .getDMChannel(checkMail.userID)
        .then((bot) => bot.createMessage('**' + config.msgPrefix + '**: ' + c.reply))
        .then(bot.createMessage(msg.channel.id, '(Annon) **' + fullU + '**: ' + c.reply), msg.delete());
    }
  },
};
