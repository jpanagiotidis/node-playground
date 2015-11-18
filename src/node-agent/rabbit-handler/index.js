'use strict';

let _ = require('underscore');
let amqp = require('amqplib');
let RabbitExchangeHandler = require('./rabbit-exchange-handler');
let RabbitQueueHandler = require('./rabbit-queue-handler');
let RabbitQueueBindingHandler = require('./rabbit-queue-binding-handler');

class RabbitHandler{
	constructor(config, eventBus){
		let self = this;

    self.config = config;
    self.eventBus = eventBus;
    self.connection = undefined;
		self.configBase = {};
		self.exchanges = {};
		self.queues = {};
		self.exchangeBindings = {};
		self.queueBindings = {};
		self.isInitialized = false;
	}

	*init(){
		let self = this;

		if(!self.isInitialized){
			console.log('INITIALIZING RABBITMQ HANDLER ');
			self.connection = yield amqp.connect();
			self.configBase.connection = self.connection;

			if(self.config.BIND_QUEUE){
				yield _.map(self.config.BIND_QUEUE, function(data){
					return bindQueue(self, data);
				});
			}

			self.isInitialized = true;
		}
	}

	*publish(exchangeData, key, message){
		let self = this;

		yield addExcahnge(self, exchangeData);
		yield self.exchanges[exchangeData.ID].publish(key, message);
	}
}

function getConfigurationData(rmq, config){
	return _.extend({}, config, rmq.configBase);
}

function *addQueue(data){
	
}

function *addExcahnge(rmq, config){
	yield rmq.init(rmq);
	if(!rmq.exchanges[config.ID]){
		config = getConfigurationData(rmq, config);
		rmq.exchanges[config.ID] = new RabbitExchangeHandler(config);
		yield rmq.exchanges[config.ID].init();
	}
}

function *bindQueue(rmq, config){
	config = getConfigurationData(rmq, config);
	let b = new RabbitQueueBindingHandler(config);
	yield b.init();
}

function *bindExchange(rmq, config){
	config = getConfigurationData(rmq, config);

}

module.exports = RabbitHandler;