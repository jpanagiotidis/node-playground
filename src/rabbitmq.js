'use strict';

let 
		_ = require('underscore'),
		amqp = require('amqplib'),
		connection = undefined,
		channel = undefined,
		exchanges = {},
		bindings = {}
;

function *start(){
	if(!connection || !channel){
		connection = yield amqp.connect();
		channel = yield connection.createChannel();
	}
}

function *addExcahnge(exData){
	yield start();
	if(!exchanges[exData.id]){
		exchanges[exData.id] = exData;

		yield channel.assertExchange(
			exData.id,
			exData.type,
			{
				durable: exData.durable
			}
		);
	}
}

function *publish(data, key, message){
	yield addExcahnge(data);
	yield channel.publish(data.id, key, new Buffer(message));
}

function *bindQueue(data){
	yield addExcahnge(data);
	if(!bindings[data.id]){
		bindings[data.id] = yield channel.assertQueue('', {exclusive: true});

		yield _.map(data.keys, function(key){
			return channel.bindQueue(bindings[data.id].queue, data.id, key);
		});
		
		channel.consume(bindings[data.id].queue, data.callback);
	}
}

module.exports = {
	publish: publish,
	bindQueue: bindQueue
}