'use strict';

const _ = require('underscore');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
const replCallbacks = [];

(function dummyREPL(){
  readline.question("Type next command:\n", function(replData) {
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
};