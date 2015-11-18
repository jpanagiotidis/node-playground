'use strict';

let
	_ = require('underscore'),
	RabbitBaseHandler = require('./rabbit-base-handler'),
	RabbitExchangeHandler = require('./rabbit-exchange-handler'),
	RabbitQueueHandler = require('./rabbit-queue-handler')
;

class RabbitQueueBindingHandler extends RabbitBaseHandler{
	constructor(config){
		super(config);

		let self = this;

		self.exchangeData = config.EXCHANGE;
		self.exchange = undefined;

		if(config.QUEUE){
			self.queueData = config.QUEUE;
		}else{
			self.queueData = {
				OPTIONS: {
					exclusive: true,
					durable: false
				}
			};
		} 
		
		self.queue = undefined;
		self.keys = config.KEYS ? config.KEYS : [''];
	}

	*init(){
		let 
			self = this
		;

		yield super.init();
		self.exchange = new RabbitExchangeHandler(
			_.extend(
				{
					connection: self.connection
				},
				self.exchangeData
			)
		);
		yield self.exchange.init();

		self.queue = new RabbitQueueHandler(
			_.extend(
				{
					connection: self.connection
				},
				self.queueData
			)
		);
		yield self.queue.init();

		yield _.map(self.keys, function(key){
			return self.channel.bindQueue(self.queue.id, self.exchange.id, key);
		});

		yield self.queue.consume();
	}
}

module.exports = RabbitQueueBindingHandler;