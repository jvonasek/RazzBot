let ytdl = require('ytdl-core');

module.exports = class Youtube {

  constructor() {
    this.voiceConnectionInfo = {};
    this.queue = [];
    this.isPlaying = false;
  }

  /**
   * Retrieves media information from youtube url, then starts playing audio.
   *
   * @param      {string}    youtubeUrl
   * @param      {object}    info
   * @param      {Function}  callback
   */
  playAudio(youtubeUrl, info) {

    this.setVoiceConnectionInfo(info);

    try {
      ytdl.getInfo(youtubeUrl, (err, mediaInfo) => {

        if (err) {
          return console.log('YTDL error: ', err);
        }

        this.addToQueue(mediaInfo);
        this.playQueue();

      });
    } catch (e) {
      console.log('YTDL eror: ', e);
    }

  }


  /**
   * Sets the voice connection information.
   *
   * @param      {object}  voiceConnectionInfo
   */
  setVoiceConnectionInfo(voiceConnectionInfo) {
    this.voiceConnectionInfo = voiceConnectionInfo;
  }


  /**
   * Gets the voice connection information.
   *
   * @return     {object}
   */
  getVoiceConnectionInfo() {
    return this.voiceConnectionInfo;
  }


  /**
   * Adds item to the queue.
   *
   * @param      {object}  track
   */
  addToQueue(track) {
    this.queue.push(track);
  }

  /**
   * Removes a first item from the queue.
   */
  shiftQueue() {
    this.queue.shift();
  }


  /**
   * Returns the queue
   *
   * @return     {array}
   */
  getQueue() {
    return this.queue;
  }


  /**
   * Skips item in the queue.
   */
  skip() {
    this.shiftQueue();
    this.playQueue(true);
  }


  /**
   * Plays the queue.
   *
   * @param      {boolean}  skip
   */
  playQueue(skip) {
    if (this.queue.length > 0 && (!this.isPlaying || skip)) {
      let voiceConnectionInfo = this.getVoiceConnectionInfo();
      let bestAudio = this.getBestAudioFormat(this.queue[0].formats);
      let encoder = this.createEncoder(bestAudio.url, voiceConnectionInfo);

      encoder.play();
      this.isPlaying = true;

      encoder.once('end', () => {
        this.isPlaying = false;
        this.shiftQueue();
        setTimeout(() => this.playQueue(voiceConnectionInfo), 1000);
      });
    }
  }

  /**
   * Gets the best audio format.
   *
   * @param      {object}  mediaInfo
   * @return     {object}
   */
  getBestAudioFormat(mediaFormats) {
    let formats = mediaFormats.filter(f => f.container === 'webm').sort((a, b) => b.audioBitrate - a.audioBitrate);
    let bestAudio = formats.find(f => f.audioBitrate > 0 && !f.bitrate) || formats.find(f => f.audioBitrate > 0);

    return bestAudio || console.log('No valid formats');
  }

  /**
   * Creates an ffmpeg encoder.
   *
   * @param      {object}  bestaudio
   * @param      {object}  info
   * @return     {object}
   */
  createEncoder(source, info) {
    return info.voiceConnection.createExternalEncoder({
      type: 'ffmpeg',
      source: source,
      outputArgs: ['-af', 'volume=0.5'],
    });
  }


  /**
   * Determines if youtube url is valid.
   *
   * @param      {string}   url
   * @return     {boolean}
   */
  isYoutubeUrlValid(url) {
    let p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    let matches = url.match(p);
    if (matches) {
      return true;
    }
    return false;
  }
}