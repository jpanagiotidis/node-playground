'use strict';

let data = require('./amqp-data');
/**
 * Binds a queue to an exchange
 */
module.exports = {
	AMQP: {
		BIND_EXCHANGE: [
			{
				SOURCE: data.EXCHANGE_ACCOUNT_FINDER,
				DESTINATION: data.EXCHANGE_P1,
        KEYS: [
          'query:find',
          'yo-yo'
        ]
			}
		],
    BIND_QUEUE: [
      {
        EXCHANGE: data.EXCHANGE_P1
      }
    ]
	}
}