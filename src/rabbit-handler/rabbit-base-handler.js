'use strict';

class RabbitBaseHandler{
	constructor(connection){
		this.connection = connection;
		this.channel = undefined;
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