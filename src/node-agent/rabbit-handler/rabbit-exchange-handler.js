'use strict';

const RabbitBaseHandler = require('./rabbit-base-handler');

class RabbitExchangeHandler extends RabbitBaseHandler{
	constructor(config){
		super(config);

		const self = this;

		self.id = config.ID;
		self.options = config.OPTIONS;
		self.type = config.TYPE;
	}

	*init(){
		const self = this;

		yield super.init();
		yield self.channel.assertExchange(
			self.id,
			self.type,
			self.options
		);
	}

	*publish(key, message){
		const self = this;

		yield self.init();
		console.log('EXCHANGE IS SENDING MESSGAGE');
		self.channel.publish(self.id, key, new Buffer(message));
	}
}

module.exports = RabbitExchangeHandler;