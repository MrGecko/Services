const seneca = require('seneca')();
const mongo = require('./src/mongo-bookshelf');
const existdb =require('./src/existdb');

require('seneca')()
  .use(mongo)
  .use(existdb)
    .listen();
