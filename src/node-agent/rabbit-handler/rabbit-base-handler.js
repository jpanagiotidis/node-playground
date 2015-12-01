'use strict';

class RabbitBaseHandler{
	constructor(config){
		this.connection = config.connection;
		this.channel = config.channel;
	}

	*init(){
		const self = this;
		yield self.checkChannel();
	}

	*checkChannel(){
		const self = this;
		if(!self.channel){
			self.channel = yield self.connection.createConfirmChannel();
		}
	}

	destroy(){
		const self = this;
		self.connection = null;
		self.channel = null;
	}
}

module.exports = RabbitBaseHandler;