'use strict';

const routes = require('./routes');
const _ = require('lodash');

module.exports = m => {
  if(routes[m.content] != null && typeof(routes[m.content]) == 'function')
    return routes[m.content](m);

  for (let r in routes) {
    if (routes.hasOwnProperty(r) && _.toLower(m.content).startsWith(r)) {
      let cmd = _.words(m.content.slice(r.length))[0];

      if(routes[r][cmd]) {
        let args = _.words(m.content.slice(r.length + cmd.length + 1), /[^, ]+/g); // +1 because space

        routes[r][cmd](m, args);
      }
      else
        m.reply("Prefix was found, but I couldn't find a command :("); // use m.reply to add your own error message here
    }
  }
};
