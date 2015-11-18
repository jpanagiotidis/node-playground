'use strict';

let 
  _ = require('underscore'),  
  eventBus = require('./event-bus')
;

class NodeAgent{
  constructor(config){
    let
      self = this;
    ;

    if(config.AMQP){
      let RabbitHandler = require('./rabbit-handler');
      self.amqp = new RabbitHandler(config.AMQP);
    }
  }


}

module.exports = NodeAgent;