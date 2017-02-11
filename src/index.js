let Discordie = require('discordie');
let fs        = require('fs');
let _         = require('underscore');

let rb        = require('./core/RazzBot');
let config    = require('./config');

let Events    = Discordie.Events;
let client    = new Discordie();
let RazzBot   = new rb();

client.connect({
  token: config.local.discordToken
});

client.Dispatcher.on(Events.GATEWAY_READY, e => {
  console.log('Connected as: ' + client.User.username);
});

client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
  RazzBot.checkMessageForCommand(e.message, (moduleName, message) => {
    if (moduleName) {
      RazzBot.runModule(moduleName, message);
    }
  });
});
