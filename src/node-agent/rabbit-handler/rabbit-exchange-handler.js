'use strict';

let
	RabbitBaseHandler = require('./rabbit-base-handler')
;

class RabbitExchangeHandler extends RabbitBaseHandler{
	constructor(config){
		super(config);

		let self = this;

		self.id = config.ID;
		self.options = config.OPTIONS;
		self.type = config.TYPE;
	}

	*init(){
		let self = this;

		yield super.init();
		yield self.channel.assertExchange(
			self.id,
			self.type,
			self.options
		);
	}

	*publish(key, message){
		let self = this;

		yield self.init();
		console.log('EXCHANGE IS SENDING MESSGAGE');
		self.channel.publish(self.id, key, new Buffer(message));
	}
}

module.exports = RabbitExchangeHandler;