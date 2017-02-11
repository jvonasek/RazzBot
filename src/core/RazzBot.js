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
      if (content.indexOf(command) === 0) {
        return callback(moduleName, message);
      }
    });
  }


  /**
   * Runs the module based on given module name.
   *
   * @param      {string}  moduleName
   * @param      {object}  message
   */
  runModule(moduleName, message) {
    try {
      this[moduleName].exec(message);
    } catch (err) {
      console.log(err);
    }
  }

}