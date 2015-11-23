'use strict';

let data = require('./amqp-data');
/**
 * Binds a queue to an exchange
 */
module.exports = {
  ID: 'PRODUCT_3',
  TYPE: 'B',
  AMQP: {
    BIND_EXCHANGE: [
      {
        SOURCE: data.EXCHANGE_ACCOUNT_FINDER,
        DESTINATION: data.EXCHANGE_P3,
        KEYS: [
          'query:find',
          'yo-yo'
        ]
      }
    ],
    BIND_QUEUE: [
      {
        EXCHANGE: data.EXCHANGE_P3,
        QUEUE: data.QUEUE_P3
      }
    ]
  }
}