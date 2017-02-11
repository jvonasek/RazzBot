let request         = require('superagent');

let AbstractCommand = require('../core/AbstractCommand');

module.exports = class Joke extends AbstractCommand {
  constructor() {
    super();
  }

  exec(message) {
    super.exec(message)
    request
      .get('https://icanhazdadjoke.com/')
      .set('Accept', 'text/plain')
      .end((err, res) => {
        this.channel.sendMessage(`*${res.text}*`);
      })
  }
}