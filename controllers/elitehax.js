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
const usersKeys = ["username", "address", "crew"];

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

  update <Username> <NewUsername> <IP> <CrewInitials>

  changename <Username> <NewUsername>

  changeip <Username> <IP>

  changecrew <Username> <CrewInitials>

  remove <Username>

  listcrews

  addcrew <CrewInitials> <CrewFullname>

  removecrew <CrewInitials>
\`\`\``;

module.exports = {
  'g!': {
    'userbank': (m, args) => {
      if(args.length === 0)
        args = ["list"];

      switch (args[0]) {

        case "help":
          if(args.length === 1) {
            m.reply(helpText);
          } else m.reply(parseErrorMsg);
          break;

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
          } else if (args.length === 2) {
            sql.all("SELECT * FROM users WHERE crew=?", args[1]).then(res => {
              if(res.length === 0)
                m.reply("I could find that crew...");
              else
                m.reply("All users in crew " + args[1] + ": \n```\n"
                        + Table.print(res, {
                            username: {name: "Username"},
                            address: {name: "IP"},
                            crew: {name: "Crew Initials"}
                          }) + "```");
            }).catch(e => console.log(e));
          } else m.reply(parseErrorMsg);
          break;

        case "add":
          if(args.length >= 2 && args.length <= 4) {
            sql.run("INSERT INTO users (" + _.take(usersKeys, args.length-1).toString() + ") VALUES (?"+ _.repeat(", ?", args.length-2) +")", _.tail(args)).then(() => {
              m.reply(`user '${args[1]}' was added to the user bank`);
            }).catch(e => {
              console.log(e);
              console.log(args);
              if(e.errno === 19)
                m.reply("That user has already been added!");
              else
                m.reply("There was an error adding that user... Please report to @Andy#7956");
            });
          } else m.reply(parseErrorMsg);
          break;

        case "update":
          if(args.length === 5) {
            sql.all("SELECT * FROM users WHERE username=?", args[1]).then(res => {
              args.push(args[1]);
              if(res.length === 0)
                m.reply("I could find that username... Check your spelling and watch out for capital letters!");
              else
                sql.run("UPDATE users SET username=?, address=?, crew=? where username=?", _.drop(args, 2)).then(() => {
                  m.reply(`User ${args[1]} has been updated`);
                }).catch(e => {console.log(e); m.reply("An error occurred... Contact Andy!")});
            }).catch(e => console.log(e));
          } else m.reply(parseErrorMsg);
          break;

        case "changename":
          if(args.length === 3) {
            sql.all("SELECT * FROM users WHERE username=?", args[1]).then(res => {
              args.push(args[1]);
              if(res.length === 0)
                m.reply("I could find that username... Check your spelling and watch out for capital letters!");
              else
                sql.run("UPDATE users SET username=? where username=?", [args[2], args[1]]).then(() => {
                  m.reply(`User ${args[1]} has been updated`);
                }).catch(e => {console.log(e); m.reply("An error occurred... Contact Andy!")});
            }).catch(e => console.log(e));
          } else m.reply(parseErrorMsg);
          break;

        case "changeip":
          if(args.length === 3) {
            sql.all("SELECT * FROM users WHERE username=?", args[1]).then(res => {
              args.push(args[1]);
              if(res.length === 0)
                m.reply("I could find that username... Check your spelling and watch out for capital letters!");
              else
                sql.run("UPDATE users SET address=? where username=?", [args[2], args[1]]).then(() => {
                  m.reply(`User ${args[1]} has been updated`);
                }).catch(e => {console.log(e); m.reply("An error occurred... Contact Andy!")});
            }).catch(e => console.log(e));
          } else m.reply(parseErrorMsg);
          break;

        case "changecrew":
          if(args.length === 3) {
            sql.all("SELECT * FROM users WHERE username=?", args[1]).then(res => {
              args.push(args[1]);
              if(res.length === 0)
                m.reply("I could find that username... Check your spelling and watch out for capital letters!");
              else
                sql.run("UPDATE users SET crew=? where username=?", [args[2], args[1]]).then(() => {
                  m.reply(`User ${args[1]} has been updated`);
                }).catch(e => {console.log(e); m.reply("An error occurred... Contact Andy!")});
            }).catch(e => console.log(e));
          } else m.reply(parseErrorMsg);
          break;

        case "remove":
          if(args.length === 2) {
            sql.run("DELETE FROM users WHERE username=?", args[1]).then(() => {
              m.reply(`user '${args[1]}' was removed from the user bank`);
            }).catch(e => {
              console.log(e);
              console.log(args);
              m.reply(`Failed to remove user '${args[1]}'`);
            });
          } else m.reply(parseErrorMsg);
          break;

        case "listcrews":
          if (args.length === 1) {
            sql.all("SELECT * FROM crews").then(res => {
              m.reply("All crews in bank: \n```\n" + Table.print(res, {initials: {name: "Initials"}, fullname: {name: "Full name"}}) + "```");
            });
          } else m.reply(parseErrorMsg);
          break;

        case "addcrew":
          if(args.length === 3) {
            sql.run("INSERT INTO crews VALUES (?, ?)", _.drop(args)).then(() => {
              m.reply(`crew ${args[1]} was added to the user bank`);
            }).catch(e => {
              console.log(e);
              m.reply(parseErrorMsg);
            });
          } else m.reply(parseErrorMsg);
          break;

        case "removecrew":
          if(args.length === 2) {
            sql.run("DELETE FROM crews WHERE initials=?", args[1]).then(() => {
              m.reply(`Crew '${args[1]}' was removed from the user bank`);
            }).catch(e => {
              console.log(e);
              console.log(args);
              m.reply(`Failed to remove crew '${args[1]}'`);
            });
          } else m.reply(parseErrorMsg);
          break;

        default:
          m.reply(parseErrorMsg)

      }
    }
  }
};
