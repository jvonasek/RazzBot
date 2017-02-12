let request         = require('superagent');

let AbstractCommand = require('../core/AbstractCommand');

const JOKE_API_URL = 'https://icanhazdadjoke.com/';

module.exports = class Joke extends AbstractCommand {
  constructor() {
    super();
  }

  exec(message) {
    super.exec(message)

    request
      .get(JOKE_API_URL)
      .set('Accept', 'text/plain')
      .end((err, res) => {
        this.channel.sendMessage(`*${res.text}*`);
      });
  }
}