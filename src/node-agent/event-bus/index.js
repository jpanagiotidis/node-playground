'use strict';

const EventEmitter = require('events');
let instance;

class EventBus extends EventEmitter{
	constructor(){
		super();
	}
}

instance = new EventBus();

module.exports = instance;