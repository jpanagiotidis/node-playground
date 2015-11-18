'use strict';

let
	RabbitBaseHandler = require('./rabbit-base-handler')
;

class RabbitQueueHandler extends RabbitBaseHandler{
	constructor(config){
		super(config);

		let self = this;
		
		if(!config.queue){
			config.queue = {
				exclusive: true,
				durable: false,
				autoDelete: true
			};
		}

		self.id = config.queue.ID ? config.queue.ID : '';
		self.options = config.queue.options ? config.options : {};
	}

	*init(){
		let 
			self = this,
			res = undefined //holds the response of the queue assertion
		; 

		yield super.init();
		res = yield self.channel.assertQueue(self.id, self.options);
		self.id = res.queue;
	}

	*consume(){
		let 
			self = this
		;

		console.log(self.id);
		self.channel.consume(self.id, function(data){
			console.log('QUEUE MESSAGE ARRIVED: ');
			console.log(data.content.toString());
		});
		console.log('VCVCCVCCV');
	}
}

module.exports = RabbitQueueHandler;