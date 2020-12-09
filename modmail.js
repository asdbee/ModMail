let get = {};

get.updateDB = (channel,closed,log) => {
    const getMail = require('./database/template.js')
    getMail.findOne({channelID: channel}).then((data) => {
    data.channelID = channel,
    data.isClosed = closed,
    data.logFile = log
    data.save()
})
}

get.configBan = (where,id,banned) => {
    const getMail = require('./database/template.js')
    if (where === 'fromChannel'){
    getMail.findOne({channelID: id}).then((data) => {
        data.isBanned = banned
        data.save()
    })}
    else if (where === 'fromUser'){
    getMail.findOne({userID: id}).then((data) => {
        data.isBanned = banned
        data.save()
})}
}

get.getChannel = (cid) => {
    const getMail = require('./database/template.js')
    return getMail.findOne({channelID: cid});
};

get.getModMail = (id) => {
    const getMail = require('./database/template.js')
    return getMail.findById(id);
};

get.createDB = (user,channel,closed,logFile,banned) => {
    const createMail = require('./database/template.js')
    const newMail = new createMail({
      _id: user,
      userID: user,
      channelID: channel,
      logFile: logFile,
      isClosed: closed,
      isBanned: banned
  })
  newMail.save()
  };

module.exports = { get }