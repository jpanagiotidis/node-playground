'use strict';

const _ = require('underscore');
const co = require('co');
const amqp = require('amqplib');
const RabbitExchangeHandler = require('./rabbit-exchange-handler');
const RabbitExchangeBindingHandler = require('./rabbit-exchange-binding-handler');
const RabbitQueueHandler = require('./rabbit-queue-handler');
const RabbitQueueBindingHandler = require('./rabbit-queue-binding-handler');
const RabbitUtils = require('./rabbit-utils');
const RabbitDefaults = require('./rabbit-defaults');
const backoff = require('backoff');
const STATES = RabbitDefaults.HANDLER_STATES;
const eventBus = require('../event-bus');
const EVENTS = require('../constants').EVENTS.AMQP.STATE;

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
    self.state = STATES.UNINITIALIZED;
    self.fib = backoff.fibonacci({
      randomisationFactor: RabbitDefaults.RECONNECT_OPTIONS.RANDOMIZATION,
      initialDelay: RabbitDefaults.RECONNECT_OPTIONS.INIT_DELAY,
      maxDelay: RabbitDefaults.RECONNECT_OPTIONS.MAX_DELAY
    });

    self.fib.on('backoff', function(number, delay){
      console.log('RabbitMQ Reconnection try: ' + number + ' ' + delay + 'ms');
    });

    self.fib.on('ready', function(number, delay){
      co(initCallback(self)).then(
        function(){
          self.state = STATES.CONNECTED;
          eventBus.emit(EVENTS.CONNECTED);
          addConnectionListeners(self);
          self.fib.reset();
        }
      ).catch(
        function(err){
          console.log('RMQ CONNECTION ERROR');
          console.log(err);
          self.fib.backoff();
        }
      );
    });

    self.connectionCloseCallback = (function(){
      const self = this;
      try{
        self.state = STATES.DISCONNECTED;
        eventBus.emit(EVENTS.DISCONNECTED);
        removeConnectionListeners(self);
        self.destroy();
        self.fib.backoff();

      }catch(e){
        console.log('ERROR on connectionCloseCallback');
        console.log(e);
      }
    }).bind(self);

    self.fib.backoff();
  }

  *publish(exchangeData, key, message, options){
    const self = this;
    if(self.state === STATES.CONNECTED){
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
    }else{
      console.log('RMQ CONNECTION UNAVAILABLE, PLEASE TRY LATER...');
    }
  }

  connectionErrorCallback(){
    const self = this;
    console.log('CONNECTION ERROR');
  }

  destroy(){
    const self = this;

    _.each(self.exchanges, function(val, key){
      val.destroy();
      delete self.exchanges[key];
    });

    _.each(self.queues, function(val, key){
      val.destroy();
      delete self.queues[key];
    });

    _.each(self.exchangeBindings, function(val, key){
      val.destroy();
      delete self.exchangeBindings[key];
    });

    _.each(self.queueBindings, function(val, key){
      val.destroy();
      delete self.queueBindings[key];
    });

    self.channel = null;
    self.connection = null;
  }
}

function getConfigurationData(rmq, config){
  return _.extend({}, config, rmq.configBase);
}

function *addExcahnge(rmq, config){
  // yield rmq.init(rmq);
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

function addConnectionListeners(rmq){
  rmq.connection.on('error', rmq.connectionErrorCallback);
  rmq.connection.on('close', rmq.connectionCloseCallback);
}

function removeConnectionListeners(rmq){
  rmq.connection.removeListener('error', rmq.connectionErrorCallback);
  rmq.connection.removeListener('close', rmq.connectionCloseCallback);
}

function *initCallback(rmq){
  rmq.connection = yield amqp.connect();
  rmq.configBase.connection = rmq.connection;

  if(rmq.config.CONSUME_QUEUE){
    yield _.map(rmq.config.CONSUME_QUEUE, function(data){
      return consumeQueue(rmq, data);
    });
  }

  if(rmq.config.BIND_EXCHANGE){
    yield _.map(rmq.config.BIND_EXCHANGE, function(data){
      return bindExchange(rmq, data);
    });
  }

  if(rmq.config.BIND_QUEUE){
    yield _.map(rmq.config.BIND_QUEUE, function(data){
      return bindQueue(rmq, data);
    });
  }
}

module.exports = RabbitHandler;