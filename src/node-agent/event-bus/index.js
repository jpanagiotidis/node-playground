'use strict';

const EventEmitter = require('events');
let instance = undefined;

class EventBus extends EventEmitter{
	constructor(){
		super();
	}
}

instance = new EventBus();

module.exports = instance;