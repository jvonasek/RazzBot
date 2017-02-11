var minimist  = require('minimist');
var spawnargs = require('spawn-args');

module.exports = class AbstractCommand {

	constructor() {
    this.message;
    this.channel;
    this.author;
    this.guild;
    this.voiceChannel;
  }


  /**
   * Executes command from given message
   *
   * @param      {object}  message
   */
  exec(message) {
    this.setProps(message);
  }

  getArgs(content) {
    return minimist(spawnargs(this.message.content));
  }


  /**
   * Sets the properties from given message
   *
   * @param      {object}  message
   */
  setProps(message) {
    this.setMessage(message);
    this.setChannel(message);
    this.setAuthor(message);
    this.setGuild(message);
    this.setVoiceChannel(message);
  }


  /**
   * Sets the message.
   *
   * @param      {object}  message
   */
  setMessage(message) {
    this.message = message;
  }


  /**
   * Sets the channel.
   *
   * @param      {object}  message
   */
  setChannel(message) {
    this.channel = message.channel;
  }


  /**
   * Sets the author.
   *
   * @param      {object}  message
   */
  setAuthor(message) {
    this.author = message.author;
  }

  /**
   * Sets the guild (server).
   *
   * @param      {object}  message
   */
  setGuild(message) {
    this.guild = message.channel.guild;
  }

  /**
   * Sets the voice channel.
   *
   * @param      {object}  message
   */
  setVoiceChannel(message) {
    this.voiceChannel = message.author.getVoiceChannel(this.guild);
  }
}