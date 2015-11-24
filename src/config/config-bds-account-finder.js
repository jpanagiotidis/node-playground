'use strict';

let data = require('./amqp-data');

module.exports = {
  NAME: 'bds-account-finder',
  TYPE: 'A',
  AMQP: {
    EXCHANGE: data.EXCHANGE_ACCOUNT_FINDER,
    CONSUME_QUEUE: [
      {
        QUEUE: data.QUEUE_ACCOUNT_FINDER
      }
    ]
  }
};