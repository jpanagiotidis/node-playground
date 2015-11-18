'use strict';

let data = require('./amqp-data');

module.exports = {
	NAME: 'bds-account-finder',
	AMQP: {
		EXCHANGE: data.EXCHANGE,
		QUEUE: data.QUEUE
	}
}