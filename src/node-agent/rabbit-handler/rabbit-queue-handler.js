'use strict';

let RabbitBaseHandler = require('./rabbit-base-handler');
let eventBus = require('../event-bus');
let EVENTS = require('../constants').EVENTS.AMQP.QUEUE;

class RabbitQueueHandler extends RabbitBaseHandler{
	constructor(config){
		super(config);

		let self = this;

		self.id = config.ID ? config.ID : '';
		self.options = config.OPTIONS ? config.OPTIONS : {};
	}

	*init(){
		let self = this;
		let res = undefined; //holds the response of the queue assertion

		yield super.init();
		res = yield self.channel.assertQueue(self.id, self.options);
		self.id = res.queue;
	}

	*consume(){
		let self = this;

		self.channel.consume(self.id, function(data){
			eventBus.emit(EVENTS.MESSAGE, self, data);
		});
	}

	ack(message, allUpTo){
		let self = this;

		allUpTo = allUpTo ? allUpTo : false;

		self.channel.ack(message, allUpTo);
	}

	reject(message, requeue){
		let self = this;

		requeue = requeue !== undefined ? requeue : true;

		self.channel.reject(message, requeue);
	}
}

module.exports = RabbitQueueHandler;