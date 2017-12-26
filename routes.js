'use strict';

const _ = require('lodash');

// Add your controllers here
const testCtrl = require('./controllers/testing');
const elitehaxCtrl = require('./controllers/elitehax');


const routes = {}
// Add your controllers here too lol
_.merge(routes, testCtrl, elitehaxCtrl);

module.exports = routes;
