'use strict';

const _ = require('lodash');
const Table = require('easy-table');
const sql = require("sqlite");
sql.open("./controllers/userbank.sqlite").then(() => {
  sql.run("CREATE TABLE IF NOT EXISTS crews (initials TEXT PRIMARY KEY, fullname TEXT NOT NULL)").then(() => {
    sql.run("CREATE TABLE IF NOT EXISTS users (username TEXT PRIMARY KEY, address TEXT, crew TEXT, FOREIGN KEY (crew) REFERENCES crews(initials))").then(() => {
      console.log("Tables found or created!");
    }).catch(e => console.log(e));
  }).catch(e => console.log(e));
}).catch(e => console.log(e));


const parseErrorMsg = `\`\`\`md
Usage:
  g!userbank <command> <args>

Example:
  g!userbank add Andy 4.20.133.7 GHOST

For commands list, do 'g!userbank help'
\`\`\``;

const helpText = `\`\`\`md
List of commands:

  find <Username (or part of a username)>

  list <CrewInitials (optional)>

  add <Username> <IP> <CrewInitials (optional)>

  update <Username> <NewUsername> <IP> <CrewInitials> // COMING SOON!

  newname <Username> <NewUsername> // COMING SOON!

  changeip <Username> <IP> // COMING SOON!

  changecrew <Username> <CrewInitials> // COMING SOON!

  remove <Username> // COMING SOON!

  listcrews

  addcrew <CrewInitials> <CrewFullname>

  removecrew <CrewInitials> // COMING SOON!
\`\`\``;

module.exports = {
  'g!': {
    'userbank': (m, args) => {
      if(args.length == 0)
        m.reply(parseErrorMsg);

      else switch (args[0]) {
        case "help":
          if(args.length === 1) {
            m.reply(helpText);
            break;
          }
        case "list":
          if (args.length === 1) {
            sql.all("SELECT * FROM users").then(res => {
              m.reply("All users in bank: \n```\n"
                      + Table.print(res, {
                          username: {name: "Username"},
                          address: {name: "IP"},
                          crew: {name: "Crew Initials"}
                        }) + "```");
            });
            break;
          } else if (args.length === 2) {
            sql.all("SELECT * FROM users WHERE crew == ?", args[1]).then(res => {
              if(res.length == 0)
                m.reply("I could find that crew...");
              else
                m.reply("All users in crew " + args[1] + ": \n```\n"
                        + Table.print(res, {
                            username: {name: "Username"},
                            address: {name: "IP"},
                            crew: {name: "Crew Initials"}
                          }) + "```");
            }).catch(e => console.log(e));
            break;
          }
        case "add":
          if(args.length >= 2 && args.length <= 4) {
            sql.run("INSERT INTO users VALUES (?"+ _.repeat(", ?", args.length-2) +")", _.drop(args)).then(() => {
              m.reply(`user '${args[1]}' was added to the user bank`);
            }).catch(e => {
              console.log(e);
              console.log(args);
              console.log("INSERT INTO users VALUES (?"+ _.repeat(", ?", args.length-2) +")");
              m.reply(parseErrorMsg);
            });
            break;
          }
        case "listcrews":
          if (args.length === 1) {
            sql.all("SELECT * FROM crews").then(res => {
              m.reply("All crews in bank: \n```\n" + Table.print(res, {initials: {name: "Initials"}, fullname: {name: "Full name"}}) + "```");
            });
            break;
          }
        case "addcrew":
          if(args.length == 3) {
            sql.run("INSERT INTO crews VALUES (?, ?)", _.drop(args)).then(() => {
              m.reply(`crew ${args[1]} was added to the user bank`);
            }).catch(e => {
              console.log(e);
              m.reply(parseErrorMsg);
            });
          }
        default:
          m.reply(parseErrorMsg)
      }
    }
  }
};
