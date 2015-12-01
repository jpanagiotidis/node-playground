'use strict';

const _ = require('underscore');
const amqp = require('amqplib');
const RabbitExchangeHandler = require('./rabbit-exchange-handler');
const RabbitExchangeBindingHandler = require('./rabbit-exchange-binding-handler');
const RabbitQueueHandler = require('./rabbit-queue-handler');
const RabbitQueueBindingHandler = require('./rabbit-queue-binding-handler');

class RabbitHandler{
  constructor(config, eventBus){
    const self = this;

    self.config = config;
    self.eventBus = eventBus;
    self.connection = undefined;
    self.channel = undefined;
    self.configBase = {};
    self.exchanges = {};
    self.queues = {};
    self.exchangeBindings = {};
    self.queueBindings = {};
    self.isInitialized = false;
  }

  *init(){
    const self = this;

    if(!self.isInitialized){
      console.log('INITIALIZING RABBITMQ HANDLER ');
      self.connection = yield amqp.connect();
      self.configBase.connection = self.connection;

      if(self.config.CONSUME_QUEUE){
        yield _.map(self.config.CONSUME_QUEUE, function(data){
          return consumeQueue(self, data);
        });
      }

      if(self.config.BIND_EXCHANGE){
        yield _.map(self.config.BIND_EXCHANGE, function(data){
          return bindExchange(self, data);
        });
      }

      if(self.config.BIND_QUEUE){
        yield _.map(self.config.BIND_QUEUE, function(data){
          return bindQueue(self, data);
        });
      }

      self.isInitialized = true;
    }
  }

  *publish(exchangeData, key, message, options){
    const self = this;

    if(exchangeData !== ''){
      yield addExcahnge(self, exchangeData);
      yield self.exchanges[exchangeData.ID].publish(key, message, options);
    }else{
      if(!self.channel){
        self.channel = yield self.connection.createConfirmChannel();
      }

      const getMessageOptions = require('./rabbit-utils').getMessageOptions;
      const confirmationCallback = require('./rabbit-utils').confirmationCallback;

      options = getMessageOptions(options);

      self.channel.sendToQueue(
        key, 
        new Buffer(message), 
        options, 
        confirmationCallback.bind({
          message: message
        })
      );
    }
  }
}

function getConfigurationData(rmq, config){
  return _.extend({}, config, rmq.configBase);
}

function *addExcahnge(rmq, config){
  yield rmq.init(rmq);
  if(!rmq.exchanges[config.ID]){
    config = getConfigurationData(rmq, config);
    rmq.exchanges[config.ID] = new RabbitExchangeHandler(config);
    yield rmq.exchanges[config.ID].init();
  }
}

function *bindQueue(rmq, config){
  config = getConfigurationData(rmq, config);
  const b = new RabbitQueueBindingHandler(config);
  rmq.queueBindings[b.id] = b;
  yield b.init();
}

function *bindExchange(rmq, config){
  config = getConfigurationData(rmq, config);
  const b = new RabbitExchangeBindingHandler(config);
  rmq.exchangeBindings[b.id] = b;
  yield b.init();
}

function *consumeQueue(rmq, config){
  config = getConfigurationData(rmq, config.QUEUE);
  const b = new RabbitQueueHandler(config);
  yield b.init();
  rmq.queues[b.id] = b;
  b.consume();
}

module.exports = RabbitHandler;