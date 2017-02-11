let ytdl = require('ytdl-core');

module.exports = class Youtube {

  /**
   * Retrieves media information from youtube url, then starts playing audio.
   * @param      {string}  youtubeUrl
   * @param      {object}  info
   */
  playAudio(youtubeUrl, info, callback) {
    try {
      ytdl.getInfo(youtubeUrl, (err, mediaInfo) => {

        if (err) {
          return console.log('YTDL error: ', err);
        }

        let bestaudio = this.getBestAudioFormat(mediaInfo);
        let encoder = this.createEncoder(bestaudio, info);

        encoder.play();

        if (typeof callback === 'function') {
          callback.call(this, mediaInfo);
        }

      });
    } catch (e) {
      console.log('YTDL eror: ', e);
    }

  }

  /**
   * Gets the best audio format.
   *
   * @param      {object}  mediaInfo
   * @return     {object}
   */
  getBestAudioFormat(mediaInfo) {
    let formats = mediaInfo.formats.filter(f => f.container === 'webm').sort((a, b) => b.audioBitrate - a.audioBitrate);
    let bestaudio = formats.find(f => f.audioBitrate > 0 && !f.bitrate) || formats.find(f => f.audioBitrate > 0);

    return bestaudio || console.log('No valid formats');
  }

  /**
   * Creates an ffmpeg encoder.
   *
   * @param      {object}  bestaudio
   * @param      {object}  info
   * @return     {object}
   */
  createEncoder(bestaudio, info) {
    return info.voiceConnection.createExternalEncoder({
      type: 'ffmpeg',
      source: bestaudio.url,
      outputArgs: ['-af', 'volume=0.5'],
    });
  }

  isYoutubeUrlValid(url) {
    let p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    let matches = url.match(p);
    if (matches) {
      return true;
    }
    return false;
  }
}