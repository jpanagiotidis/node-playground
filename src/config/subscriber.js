'use strict';

let data = require('./amqp-data');
/**
 * Binds a queue to an exchange
 */
module.exports = {
	AMQP: {
		BIND_QUEUE: [
			{
				EXCHANGE: data.EXCHANGE_ACCOUNT_FINDER
			}
		]
	}
}