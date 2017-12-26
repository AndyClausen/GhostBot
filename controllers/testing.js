'use strict';

module.exports = {
  'g!': { // prefix
    'ping': (m, args) => { // command
      m.reply('pong');
    }
  },
  'ping': (m, args) => { // command
    m.reply('pong');
  }
}
