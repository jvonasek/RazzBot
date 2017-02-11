let _      = require('underscore');

let config = require('../config');
let Say    = require('../modules/Say');
let Play   = require('../modules/Play');

module.exports = class RazzBot {
  constructor() {
    this.commands = config.commands;
    this.Say = new Say;
    this.Play = new Play;
  }


  /**
   * Checks the given message for command,
   * proceeds to run a callback, if the command is valid.
   *
   * @param      {object}    message
   * @param      {Function}  callback
   */
  checkMessageForCommand(message, callback) {
    let content = message.content.toLowerCase();

    _.each(this.commands, (command, moduleName) => {

      // find main module trigger
      if (content.indexOf(command.trigger) === 0) {
        return callback(moduleName, message);
      }

      // find subcommands
      let subcommandIndex = _.indexOf(command.subcommands, content);
      if (subcommandIndex >= 0) {
        return callback(moduleName, message, command.subcommands[subcommandIndex]);
      }
    });
  }


  /**
   * Runs the module based on given module name.
   *
   * @param      {string}  moduleName
   * @param      {object}  message
   */
  runModule(moduleName, message, subcommand) {
    try {
      this[moduleName].exec(message, subcommand);
    } catch (err) {
      console.log(err);
    }
  }

}