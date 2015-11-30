'use strict';

const _ = require('underscore');
const RabbitBaseHandler = require('./rabbit-base-handler');
const messageDefaults = require('./rabbit-defaults').MESSAGE_OPTIONS;

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

	*publish(key, message, options){
		const self = this;

		options = options ? options : {};

		_.defaults(options, messageDefaults);

		console.log(options);

		yield self.init();
		console.log('EXCHANGE IS SENDING MESSGAGE');
		self.channel.publish(self.id, key, new Buffer(message), options);
	}
}

module.exports = RabbitExchangeHandler;