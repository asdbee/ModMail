const mail = require('../modmail.js').get;
const config = require('../config.js');
const path = require('path');
const fs = require('fs');
module.exports = {
  name: 'close',
  description: 'Closes a Modmail thread.',
  usage: '{prefix}annon [text]',
  shortHands: [''],
  execute(client, msg, args, checkMail) {
    if (checkMail === null) return client.createMessage(msg.channel.id, '`!` There is no ModMail affiliated with this channel.');
    if (args[1] === undefined) {
      mail.updateDB(msg.channel.id, true, false);
      client
        .getDMChannel(checkMail.userID)
        .then((client) => client.createMessage('**ModMail Notification**: Your ModMail has been closed. Reply to create a new one.'))
        .then(() => {
          client.createMessage(config.logChannel, {
            embed: {
              title: 'ModMail Closed',
              fields: [
                {
                  name: 'ModMail',
                  value: msg.channel.name + '\n(`' + msg.channel.id + '`)',
                  inline: true,
                },
                {
                  name: 'Details',
                  value: 'Moderator: ' + msg.author.mention + '\n(' + msg.author.username + '#' + msg.author.discriminator + ')',
                  inline: true,
                },
              ],
              color: config.color,
            },
          });
          try {
            const file = path.join(__dirname, '../logs/' + msg.channel.id + '.txt');
            const buffer = fs.readFileSync(file);
            client
              .createMessage(config.logChannel, `ModMail Transcript (${msg.channel.id})`, {
                file: buffer,
                name: 'transcript.txt',
              })
              .then(msg.channel.delete());
          } catch (error) {
            client.createMessage(msg.channel.id, '`X` Unable to close channel due to an error.\n`' + error + '`');
          }
        });
    } else if (args[1] === 'silent') {
      client.createMessage(config.logChannel, {
        embed: {
          title: 'ModMail Closed',
          fields: [
            {
              name: 'ModMail',
              value: msg.channel.name + '\n(`' + msg.channel.id + '`)',
              inline: true,
            },
            {
              name: 'Details',
              value: 'Moderator: ' + msg.author.mention + '\n(' + msg.author.username + '#' + msg.author.discriminator + ')',
              inline: true,
            },
          ],
          color: config.color,
        },
      });
      try {
        const file = path.join(__dirname, '../logs/' + msg.channel.id + '.txt');
        const buffer = fs.readFileSync(file);
        client
          .createMessage(config.logChannel, `ModMail Transcript (${msg.channel.id})`, {
            file: buffer,
            name: 'transcript.txt',
          })
          .then(msg.channel.delete());
      } catch (error) {
        client.createMessage(msg.channel.id, '`X` Unable to close channel due to an error.\n`' + error + '`');
      }
    } else if (args[1] === 'with') {
      const getW = msg.content.slice(config.prefix.length + args[0].length + args[1].length + 2);
      client
        .getDMChannel(checkMail.userID)
        .then((client) => client.createMessage('**ModMail Notification**: Your ModMail has been closed. ' + getW))
        .then(() => {
          client.createMessage(config.logChannel, {
            embed: {
              title: 'ModMail Closed',
              fields: [
                {
                  name: 'ModMail',
                  value: msg.channel.name + '\n(`' + msg.channel.id + '`)',
                  inline: true,
                },
                {
                  name: 'Details',
                  value: 'Moderator: ' + msg.author.mention + '\n(' + msg.author.username + '#' + msg.author.discriminator + ')',
                  inline: true,
                },
              ],
              color: config.color,
            },
          });
          try {
            const file = path.join(__dirname, '../logs/' + msg.channel.id + '.txt');
            const buffer = fs.readFileSync(file);
            client
              .createMessage(config.logChannel, `ModMail Transcript (${msg.channel.id})`, {
                file: buffer,
                name: 'transcript.txt',
              })
              .then(msg.channel.delete());
          } catch (error) {
            client.createMessage(msg.channel.id, '`X` Unable to close channel due to an error.\n`' + error + '`');
          }
        });
    }
  },
};
