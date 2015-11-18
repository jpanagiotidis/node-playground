'use strict';

let 
  _ = require('underscore'),
  readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  }),
  replCallbacks = []
;

(function dummyREPL(){
  readline.question("Type next command:", function(replData) {
    _.each(replCallbacks, function(cb){
      if(_.isFunction(cb)){
        cb(replData);
      }
    });
    dummyREPL();
  });
})();

module.exports = {
	callbacks: replCallbacks
}