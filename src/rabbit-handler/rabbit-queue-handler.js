'use strict';

let
	RabbitBaseHandler = require('./rabbit-base-handler')
;

class RabbitQueueHandler extends RabbitBaseHandler{
	constructor(connection, data){
		super(connection);

		let self = this;
		
		if(!data){
			data = {};
		}

		data.ID ? self.id = data.ID : self.id = '';
		data.options ? self.options = data.options : self.options = {};
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
			console.log(data.content);
		});
		console.log('VCVCCVCCV');
	}
}

module.exports = RabbitQueueHandler;