'use strict';

const data = require('./amqp-data');
/**
 * Binds a queue to an exchange
 */
module.exports = {
  ID: 'PRODUCT_1',
  TYPE: 'PRODUCT',
  AMQP: {
		BIND_EXCHANGE: [
			{
				SOURCE: data.EXCHANGE_ACCOUNT_FINDER_REQUESTS,
				DESTINATION: data.EXCHANGE_P1
			}
		],
    BIND_QUEUE: [
      {
        EXCHANGE: data.EXCHANGE_P1,
        QUEUE: data.QUEUE_P1
      }
    ]
	}
};