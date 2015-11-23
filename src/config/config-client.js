'use strict';

let data = require('./amqp-data');

module.exports = {
  TYPE: 'C',
  AMQP: {
    CONSUME_QUEUE: [
      {
        QUEUE: data.QUEUE_CLIENT
      }
    ]
  }
}