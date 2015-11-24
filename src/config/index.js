'use strict';

const _ = require('underscore');
const fs = require('fs');
const path = require('path');
const chance = new require('chance')();

function getConfiguration(){
	const args = processArgs();
	let config = {
		NAME: chance.hash()
	};
	let fileConfig;

	if(args.CONFIG){
		fileConfig = getFileConfig(args.CONFIG);
		_.extend(config, fileConfig);
	}

	_.extend(config, args);

	return config;
}

function getFileConfig(confName){
	let out;
	const absPath = path.resolve(__dirname + '/' + confName + '.js');
	const fileExists = fs.existsSync(absPath);
	if (fileExists) {
		out = require('./' + confName);
	}
	return out;
}

function processArgs(){
  const out = {};

  _.each(process.argv, function(value){
    value = value.split('=');
    if(value.length > 1){
    	out[value[0]] = value[1];
    }
  });

  return out;
}

module.exports = getConfiguration();