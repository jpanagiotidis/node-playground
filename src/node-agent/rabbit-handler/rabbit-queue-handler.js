'use strict';

let
	RabbitBaseHandler = require('./rabbit-base-handler')
;

class RabbitQueueHandler extends RabbitBaseHandler{
	constructor(config){
		super(config);

		let self = this;

		self.id = config.ID ? config.ID : '';
		self.options = config.OPTIONS ? config.OPTIONS : {};
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