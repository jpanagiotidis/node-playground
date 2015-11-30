'use strict';
const Chance = require('chance');
const chance = new Chance();

const optionsDurable = {
  durable: true,
  autoDelete: false
};

const optionsTemp = {
  durable: false,
  autoDelete: true
};

module.exports = {
  EXCHANGE_ACCOUNT_FINDER_REQUESTS: {
    ID: 'bds-af-req',
    TYPE: 'fanout',
    OPTIONS: optionsDurable
  },
  EXCHANGE_ACCOUNT_FINDER_RESPONSES: {
    ID: 'bds-af-res',
    TYPE: 'direct',
    OPTIONS: optionsDurable
  },
  EXCHANGE_P1: {
    ID: 'bds-p1-exchange',
    TYPE: 'topic',
    OPTIONS: optionsDurable
  },
  QUEUE_P1: {
    ID: 'bds-p1-queue',
    OPTIONS: optionsDurable
  },
  EXCHANGE_P2: {
    ID: 'bds-p2-exchange',
    TYPE: 'fanout',
    OPTIONS: optionsDurable
  },
  QUEUE_P2: {
    ID: 'bds-p2-queue',
    OPTIONS: optionsDurable
  },
  EXCHANGE_P3: {
    ID: 'bds-p3-exchange',
    TYPE: 'direct',
    OPTIONS: optionsDurable
  },
  QUEUE_P3: {
    ID: 'bds-p3-queue',
    OPTIONS: optionsDurable
  },
  QUEUE_CLIENT: {
    ID: chance.string({
      length: 32,
      pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    }),
    OPTIONS: optionsTemp
  }
};