'use strict';

let _ = require('underscore');
let amqp = require('amqplib');
let RabbitExchangeHandler = require('./rabbit-exchange-handler');
let RabbitExchangeBindingHandler = require('./rabbit-exchange-binding-handler');
let RabbitQueueHandler = require('./rabbit-queue-handler');
let RabbitQueueBindingHandler = require('./rabbit-queue-binding-handler');

class RabbitHandler{
  constructor(config, eventBus){
    let self = this;

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
    let self = this;

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

  *publish(exchangeData, key, message){
    let self = this;

    if(exchangeData !== ''){
      yield addExcahnge(self, exchangeData);
      yield self.exchanges[exchangeData.ID].publish(key, message);
    }else{
      if(!self.channel){
        self.channel = yield self.connection.createChannel();
      }

      self.channel.sendToQueue(key, new Buffer(message));
    }
  }
}

function getConfigurationData(rmq, config){
  return _.extend({}, config, rmq.configBase);
}

function *addQueue(data){

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
  let b = new RabbitQueueBindingHandler(config);
  rmq.queueBindings[b.id] = b;
  yield b.init();
}

function *bindExchange(rmq, config){
  config = getConfigurationData(rmq, config);
  let b = new RabbitExchangeBindingHandler(config);
  rmq.exchangeBindings[b.id] = b;
  yield b.init();
}

function *consumeQueue(rmq, config){
  config = getConfigurationData(rmq, config.QUEUE);
  let b = new RabbitQueueHandler(config);
  rmq.queues[b.id] = b;
  yield b.init();
  yield b.consume();
}

module.exports = RabbitHandler;