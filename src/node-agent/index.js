'use strict';

let 
  _ = require('underscore'),  
  eventBus = require('./event-bus'),
  RabbitHandler = require('./rabbit-handler')
;

class NodeAgent{
  constructor(config){
    let
      self = this
    ;

    self.config = config;
    self.amqp = undefined;

    if(self.config.AMQP){
      self.amqp = new RabbitHandler(config.AMQP);
    }
  }

  *init(){
    console.log('INITIALIZING NODE AGENT...');
    let
      self = this
    ;

    if(self.amqp){
      yield self.amqp.init();
    }
  }
}

module.exports = NodeAgent;