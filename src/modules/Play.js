let Command = require('../core/Command');
let Youtube = require('../core/Youtube');

module.exports = class Play extends Command {
  constructor() {
    super();

    this.Youtube = new Youtube;
  }


  /**
   * Executes command for given message
   *
   * @param      {object}  message
   */
  exec(message) {
    super.exec(message);

    this.startPlaying();
  }


  /**
   * Joins voice channel if available.
   * Stars playing passed youtube url
   */
  startPlaying() {
    if (this.voiceChannel) {
      // TODO pass youtube url from message
      this.voiceChannel.join().then(info => this.Youtube.playAudio('https://www.youtube.com/watch?v=KfmQuavvs9w', info));
    } else {
      this.channel.sendMessage('You are not in a voice channel.');
    }
  }

}