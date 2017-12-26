'use strict';

const routes = require('./routes');
const _ = require('lodash');

module.exports = m => {
  if(routes[m.content] != null)
    return routes[m.content](m);

  for (let r in routes) {
    if (routes.hasOwnProperty(r) && m.content.length > r.length && _.toLower(m.content).startsWith(r)) {
      let cmd = _.words(m.content.slice(r.length))[0];

      if(routes[r][cmd]) {
        let args = _.trim(m.content.slice(r.length + cmd.length + 1)); // +1 because space

        routes[r][cmd](m, args);
      }
      else
        console.log("Prefix was found, but I couldn't find the inner command :("); // use m.reply to add your own message here
    }
  }
};
