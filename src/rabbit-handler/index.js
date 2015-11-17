'use strict';

let 
	_ = require('underscore'),
	amqp = require('amqplib'),
	RabbitExchangeHandler = require('./rabbit-exchange-handler'),
	RabbitQueueHandler = require('./rabbit-queue-handler'),
	RabbitQueueBindingHandler = require('./rabbit-queue-binding-handler'),
	connection = undefined,
	exchanges = {},
	queues = {},
	exchangeBindings = {},
	queueBindings = {}
;

function *init(){
	if(!connection){
		connection = yield amqp.connect();
	}
}

function *addQueue(data){
	
}

function *addExcahnge(exData){
	yield init();
	if(!exchanges[exData.ID]){
		exchanges[exData.ID] = new RabbitExchangeHandler(connection, exData);
		yield exchanges[exData.ID].init();
	}
}

function *publish(data, key, message){
	yield addExcahnge(data);
	yield exchanges[data.ID].publish(key, message);
}

function *bindQueue(data){
	yield init();
	let b = new RabbitQueueBindingHandler(connection, data);
	yield b.init();
	
	// yield init();
	// let q = new RabbitQueueHandler(connection, {});
	// yield q.init();


	// let ex = data.EXCHANGE;
	// yield addExcahnge(ex);
	// if(!bindings[ex.id]){
	// 	bindings[ex.id] = yield channel.assertQueue('', {exclusive: true});

	// 	yield _.map(data.KEYS, function(key){
	// 		return channel.bindQueue(bindings[ex.id].queue, ex.id, key);
	// 	});
		
	// 	channel.consume(bindings[ex.id].queue, data.CALLBACK);
	// }
}

module.exports = {
	publish: publish,
	bindQueue: bindQueue
}