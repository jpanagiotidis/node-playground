'use strict';

const RabbitHandler = require('./rabbit-handler');
const eventBus = require('./event-bus');
const constants = require('./constants');

class NodeAgent{
  constructor(config){
    const self = this;

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
    const self = this;
  }
}

module.exports = NodeAgent;