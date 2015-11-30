'use strict';

const data = require('./amqp-data');

module.exports = {
  TYPE: 'CLIENT',
  AMQP: {
    BIND_QUEUE: [
      {
        EXCHANGE: data.EXCHANGE_ACCOUNT_FINDER_RESPONSES,
        QUEUE: data.QUEUE_CLIENT,
        KEYS: [
          data.QUEUE_CLIENT.ID
        ]
      }
    ],
    CONSUME_QUEUE: [
      {
        QUEUE: data.QUEUE_CLIENT
      }
    ]
  }
};