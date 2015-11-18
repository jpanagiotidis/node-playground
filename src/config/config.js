'use strict';

module.exports = {
	amqp: {
		exchanges: {
			exProducts: {
				id: 'ex-products',
				durable: false,
				type: 'topic'
			}
		}
	}
};