'use strict';

let 
	_ = require('underscore'),
	amqp = require('amqplib'),
	RabbitExchangeHandler = require('./rabbit-exchange-handler'),
	RabbitQueueHandler = require('./rabbit-queue-handler'),
	RabbitQueueBindingHandler = require('./rabbit-queue-binding-handler')
;

class RabbitHandler{
	constructor(){
		let
      self = this
    ;

    self.connection = undefined;
		self.configBase = {};
		self.exchanges = {};
		self.queues = {};
		self.exchangeBindings = {};
		self.queueBindings = {};
	}

	*publish(exchangeData, key, message){
		yield addExcahnge(data);
		yield exchanges[exchangeData.ID].publish(key, message);
	}
}

function *init(rmq){
	if(!rmq.connection){
		rmq.connection = yield amqp.connect();
		rmq.configBase.connection = rmq.connection;
	}
}

function getConfigurationData(rmq, config){
	return _.extend({}, config, rmq.configBase);
}

function *addQueue(data){
	
}

function *addExcahnge(rmq, config){
	yield init(rmq);
	if(!rmq.exchanges[config.ID]){
		config = getConfigurationData(rmq, config);
		rmq.exchanges[config.ID] = new RabbitExchangeHandler(config);
		yield rmq.exchanges[config.ID].init();
	}
}

// function 

function *bindQueue(rmq, config){
	yield init(rmq);
	config = getConfigurationData(rmq, config);
	let b = new RabbitQueueBindingHandler(config);
	yield b.init();
}

module.exports = RabbitHandler;
// {
// 	publish: publish,
// 	bindQueue: bindQueue
// }