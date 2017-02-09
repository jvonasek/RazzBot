let ytdl = require('ytdl-core');

module.exports = class Youtube {


  /**
   * Plays audio
   * @param      {string} youtubeUrl
   * @param      {object} info
   */
  playAudio(youtubeUrl, info) {
    try {
      ytdl.getInfo(youtubeUrl, (err, mediaInfo) => {

        if (err) {
          return console.log('YTDL error: ', err);
        }

        let bestaudio = this.getBestAudioFormat(mediaInfo);
        let encoder = this.createEncoder(bestaudio, info);

        encoder.play();
      });
    } catch (e) {
      console.log('YTDL eror: ', e);
    }

  }

  /**
   * Gets the best audio format.
   *
   * @param      {object}  mediaInfo  The media information
   * @return     {object}  The best audio format.
   */
  getBestAudioFormat(mediaInfo) {
    let formats = mediaInfo.formats.filter(f => f.container === 'webm').sort((a, b) => b.audioBitrate - a.audioBitrate);
    let bestaudio = formats.find(f => f.audioBitrate > 0 && !f.bitrate) || formats.find(f => f.audioBitrate > 0);

    return bestaudio || console.log('[playRemote] No valid formats');
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
}