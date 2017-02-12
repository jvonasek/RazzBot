let _               = require('underscore');

let AbstractCommand = require('../core/AbstractCommand');


module.exports = class Member extends AbstractCommand {
  constructor(config) {
    super();

    this.entries = config.local.member;
  }

  exec(message) {
    super.exec(message)

    let randomEntry = _.sample(this.entries);

    this.channel.sendMessage(`Member ${randomEntry.text}?`)
    this.channel.sendMessage(randomEntry.link);
  }
}