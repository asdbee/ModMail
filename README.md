# ModMail

Welcome to ModMail. ModMail is an open-source ModMail bot that helps Discord Guild Moderators help their community easily and privately!

Information: This bot is written in Eris. You'll need to install [node.js](https://nodejs.org/en/) to run it. This bot not hosted anywhere, you will have to host it yourself. For starter users you can use things like [glitch.com](https://glitch.com/).

# Getting started

To setup the bot, head over to [Discord's developer portal](https://discord.com/developers/applications), click new application, then bot, and add a bot account. Copy the token and put it into the token slot of the config file. To run, ensure you have all the components installed;

`npm install eris`
`npm install moment`
`npm install axios`

### Configure the bot in config.js

```
    token: 'YOUR BOT TOKEN HERE',
    databaseToken: 'YOUR MONGODB TOKEN HERE', // We use MongoDB to store data! https://www.mongodb.com/

    mainGuild: '', // Main ModMail Guild ID (server)
    logChannel: '', // Channel ID of where you want ModMail Logs
    mailChannel: '', // **Category** ID of where you want ModMail channels to be!
    modRoles: [''],
    useOverwrites: false, // Set this to true if you'd like to sync the modmail channel with the parent category (This will void mod roles)

    status: 'DM me for support!', // This will be the bot's playing status
    color: 0xfcfcfc, // Color of logging embeds
    prefix: '!', // Bot prefix for commands
    msgPrefix: 'Staff' // The prefix that shows on messages (ex. Staff pink,: Hi!)
    channelTopic: 'ModMail Channel' // This is what the channel topic is set to upon creation.
```

A list of all commands can be found [here](https://github.com/asdbee/ModMail/blob/master/help.md)

**If you're running into any issues with your current ModMail, ensure that all code is updated. If you still encounter an error, post an [issue](https://github.com/asdbee/ModMail/issues)**
