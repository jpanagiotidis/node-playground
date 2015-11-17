'use strict';

let
	RabbitBaseHandler = require('./rabbit-base-handler')
;

class RabbitExchangeHandler extends RabbitBaseHandler{
	constructor(connection, data){
		super(connection);
		this.id = data.ID;
		this.durable = data.DURABLE;
		this.type = data.TYPE;
	}

	*init(){
		let self = this;

		yield super.init();
		yield self.channel.assertExchange(
			self.id,
			self.type,
			{
				durable: self.durable
			}
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