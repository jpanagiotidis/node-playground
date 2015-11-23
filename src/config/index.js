'use strict';

let 
	_ = require('underscore'),
	fs = require('fs'),
	path = require('path'),
	chance = new require('chance')()
;

function getConfiguration(){
	let 
		args = processArgs(),
		config = {
			NAME: chance.hash()
		},
		fileConfig = undefined
	;

	if(args['CONFIG']){
		fileConfig = getFileConfig(args['CONFIG']);
		// console.log(fileConfig);
		_.extend(config, fileConfig);
	}

	_.extend(config, args);

	return config;
}

function getFileConfig(confName){
	let out = undefined;
	let absPath = path.resolve(__dirname + '/' + confName + '.js');
	let fileExists = fs.existsSync(absPath);
	if (fileExists) {
		out = require('./' + confName);
	}
	return out;
}

function processArgs(){
  let out = {};

  _.each(process.argv, function(value){
    value = value.split('=');
    value.length > 1 ? out[value[0]] = value[1] : _.noop();
  });

  return out;
}

module.exports = getConfiguration();