'use strict';

const _ = require('underscore');
const co = require('co');
const messageDefaults = require('./rabbit-defaults').MESSAGE_OPTIONS;
const eventBus = require('../event-bus');
const EVENTS = require('../constants').EVENTS.AMQP;

module.exports = {
  getMessageOptions: function(options){
    options = options ? options : {};

    _.defaults(options, messageDefaults);

    return options;
  },
  confirmationCallback: function(err){
    let self = this;
    if(err !== null){
      eventBus.emit(EVENTS.MESSAGE.CONFIRMATION_NACK, self.message);
    }else{
      eventBus.emit(EVENTS.MESSAGE.CONFIRMATION_ACK, self.message);
    }
  }
};