'use strict';

let RabbitHandler = require('./rabbit-handler');
let eventBus = require('./event-bus');
let constants = require('./constants');

class NodeAgent{
  constructor(config){
    let self = this;

    self.config = config;
    self.constants = constants;
    self.eventBus = eventBus;
    self.amqp = undefined;

    if(self.config.AMQP){
      self.amqp = new RabbitHandler(config.AMQP, self.eventBus);
    }
  }

  *init(){
    console.log('INITIALIZING NODE AGENT...');
    let self = this;

    if(self.amqp){
      yield self.amqp.init();
    }
  }
}

module.exports = NodeAgent;