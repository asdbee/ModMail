const config = require('../config.js');
module.exports = {
  name: 'annon',
  description: 'Replies to a user in a ModMail thread without your username showing..',
  usage: '{prefix}annon [text]',
  shortHands: ['ar'],
  execute(client, msg, args, checkMail) {
    if (checkMail === null) return client.createMessage(msg.channel.id, '`!` There is no ModMail affiliated with this channel.');
    const fullU = msg.author.username + '#' + msg.author.discriminator;
    if (args[1] === undefined) return;
    const content = msg.content.slice(config.prefix.length + args[0].length + 1);
    client
      .getDMChannel(checkMail.userID)
      .then((client) => client.createMessage('**' + config.msgPrefix + '**: ' + content))
      .then(client.createMessage(msg.channel.id, '(ANNON) **' + fullU + '**: ' + content), msg.delete());
  },
};
