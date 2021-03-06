let _      = require('underscore');

let config = require('../config');
let Play   = require('../modules/Play');
let Joke   = require('../modules/Joke');
let Say    = require('../modules/Say');
let Member = require('../modules/Member');

module.exports = class RazzBot {
  constructor() {
    this.commands = config.commands;

    this.Play = new Play();
    this.Joke = new Joke();
    this.Say = new Say();
    this.Member = new Member(config);
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
   * @param      {string}  subcommand
   */
  runModule(moduleName, message, subcommand) {
    try {
      this[moduleName].exec(message, subcommand);
    } catch (err) {
      console.log(err);
    }
  }

}