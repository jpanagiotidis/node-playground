'use strict';

const EventEmitter = require('events');

class EventBus extends EventEmitter{
	constructor(){
		super();
	}
}

const instance = new EventBus();

module.exports = instance;