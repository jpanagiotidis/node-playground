'use strict';

const data = require('./amqp-data');
/**
 * Binds a queue to an exchange
 */
module.exports = {
  ID: 'PRODUCT_2',
  TYPE: 'B',
  AMQP: {
    BIND_EXCHANGE: [
      {
        SOURCE: data.EXCHANGE_ACCOUNT_FINDER,
        DESTINATION: data.EXCHANGE_P2,
        KEYS: [
          'query:find',
          'yo-yo'
        ]
      }
    ],
    BIND_QUEUE: [
      {
        EXCHANGE: data.EXCHANGE_P2,
        QUEUE: data.QUEUE_P2
      }
    ]
  }
};