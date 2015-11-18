'use strict';

class RabbitBaseHandler{
	constructor(config){
		this.connection = config.connection;
		this.channel = config.channel;
	}

	*init(){
		let self = this;
		yield self.checkChannel();
	}

	*checkChannel(){
		let self = this;
		if(!self.channel){
			self.channel = yield self.connection.createChannel();
		}
	}
}

module.exports = RabbitBaseHandler;