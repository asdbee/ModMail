const mail = require('../modmail.js').get;
const config = require('../config.js');
const moment = require('moment');

function updateDB(id, channel, closed, log) {
  const getMail = require('../database/template.js');
  getMail.findById(id).then((data) => {
    (data.channelID = channel), (data.isClosed = closed), (data.logFile = log);
    data.save();
  });
}

module.exports = {
  name: 'open',
  description: 'Opens a ModMail for a user.',
  usage: '{prefix}open user',
  shortHands: ['r'],
  execute(client, msg, args, checkMail) {
    if (args[1] === undefined) return;
    const user = args[1].replace(/[\\<>@#&!]/g, '');
    mail.getModMail(user).then((mm) => {
      let userObject;
      client.getRESTGuildMember(config.mainGuild, user).then(async (userOb) => {
        if (userOb === undefined) return client.createMessage(msg.channel.id, "`!` This user isn't in this server!");
        userObject = userOb;

        if (mm !== null) {
          if (mm.isClosed === false) return client.createMessage(msg.channel.id, '`!` This user already has a thread open!');
          client.createChannel(config.mainGuild, userObject.username + ' ' + userObject.discriminator, 0).then(async (newMail) => {
            await updateDB(userObject.id, newMail.id, false, '');
            await newMail.edit({ parentID: config.mailChannel });
            await newMail.editPermission(config.mainGuild, '0', '1024', 'role', '@everyone view denied.');
            await config.modRoles.forEach((r) => {
              newMail.editPermission(r, '52224', '8192', 'role', 'ModRole view allowed.');
            });
            await newMail.editPermission(client.user.id, '52224', '0', 'member', 'ModMail app allowed.');
            await client.createMessage(newMail.id, 'New ModMail\n—————————————————\n**Account Information**\n\nCreation Date: ' + moment(userObject.createdAt).format('lll') + '\nJoined Server: ' + moment(userOb.joinedAt).format('lll') + '\n\n**This thread was opened by ' + msg.author.username + '#' + msg.author.discriminator + '**');
            await client.getDMChannel(userObject.id).then((client) => client.createMessage('`!` A ModMail thread has been opened for you.'));
          });
        } else if (mm === null) {
          client.createChannel(config.mainGuild, userObject.username + ' ' + userObject.discriminator, 0).then(async (newMail) => {
            await mail.createDB(userObject.id, newMail.id, false, false);
            await newMail.edit({ parentID: config.mailChannel });
            await newMail.editPermission(config.mainGuild, '0', '1024', 'role', '@everyone view denied.');
            await config.modRoles.forEach((r) => {
              newMail.editPermission(r, '52224', '8192', 'role', 'ModRole view allowed.');
            });
            await newMail.editPermission(client.user.id, '52224', '0', 'member', 'ModMail app allowed.');
            await client.createMessage(newMail.id, 'New ModMail\n—————————————————\n**Account Information**\n\nCreation Date: ' + moment(userObject.createdAt).format('lll') + '\nJoined Server: ' + moment(userOb.joinedAt).format('lll') + '\n\n**This thread was opened by ' + msg.author.username + '#' + msg.author.discriminator + '**');
            await client.getDMChannel(userObject.id).then((client) => client.createMessage('`!` A ModMail thread has been opened for you.'));
          });
        }
      });
    });
  },
};
