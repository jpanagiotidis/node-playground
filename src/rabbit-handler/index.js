'use strict';

let 
	_ = require('underscore'),
	amqp = require('amqplib'),
	RabbitExchangeHandler = require('./rabbit-exchange-handler'),
	RabbitQueueHandler = require('./rabbit-queue-handler'),
	RabbitQueueBindingHandler = require('./rabbit-queue-binding-handler'),
	connection = undefined,
	configBase = {},
	exchanges = {},
	queues = {},
	exchangeBindings = {},
	queueBindings = {}
;

function *init(){
	if(!connection){
		connection = yield amqp.connect();
		configBase.connection = connection;
	}
}

function addConfigurationData(config){
	return _.extend({}, config, configBase)
}

function *addQueue(data){
	
}

function *addExcahnge(config){
	yield init();
	if(!exchanges[config.ID]){
		config = addConfigurationData(config);
		exchanges[config.ID] = new RabbitExchangeHandler(config);
		yield exchanges[config.ID].init();
	}
}

function *publish(data, key, message){
	yield addExcahnge(data);
	yield exchanges[data.ID].publish(key, message);
}

function *bindQueue(config){
	yield init();
	config = addConfigurationData(config);
	let b = new RabbitQueueBindingHandler(config);
	yield b.init();
}

module.exports = {
	publish: publish,
	bindQueue: bindQueue
}