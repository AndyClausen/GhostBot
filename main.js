'use strict';
let config;

try {
  config = require('./config.json');
} catch (e) {
  console.log(`Couldn't find a config file!
Add a config file called "config.json" with the contents:
{
  'token': 'yourtokenhere'
}`
  );
}
if(!config) return;
const handler = require('./handler');
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log("Ready!");
});

client.on('message', handler);

client.login(config.token);
