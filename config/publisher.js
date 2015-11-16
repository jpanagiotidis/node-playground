'use strict';

module.exports = {
	NAME: 'bds-account-finder',
	AMQP: {
		EXCHANGE: {
			id: 'ex-products',
			durable: false,
			type: 'topic'
		}
	}
}