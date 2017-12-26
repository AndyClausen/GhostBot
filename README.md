# GhostBot
To start: `npm start`

Make sure you have a config.json file with the following contents:
```js
{
  'token': 'your-token-here'
}
```

# Adding new controllers
Look at `./controllers/testing.js` and copy paste into new file.
In case that's not enough:

## Adding new routes in controllers
Let's say you want to add the full command `g!say hi`, you have three parts:

 * A prefix `g!`
 * A command `say`
 * An argument `hi`
 
To insert this into a controller you would do the following:
```js
module.exports = {
  'g!': { // prefix
    'say': (m, args) => { // command
      m.reply(args[0]); // argument "hi"
    }
  }
}
```
