
const fetch = require('node-fetch');
const convert = require('xml-js');

const Promise = require('bluebird');


function listTitles(msg, respond) {
  return  new Promise(function(resolve, reject){
		 resolve();
   }
   ).then(function() {
    fetch('http://localhost:8081/exist/rest/db/xquery/TEI.xql',
    {
        method: 'GET',
        headers: { 'content-type': 'application/xquery' }
    }
  ).then(function(data) {
        data.text().then(function(xml){
          var json = convert.xml2json(xml, {compact: true, spaces: 0});
          respond(null, JSON.parse(json));
          }
        );
    });
  });
}

module.exports = function existdb(options) {

  this.add('role:existdb,cmd:listTitles', listTitles);
  console.log('listTitles added to Seneca');

}
