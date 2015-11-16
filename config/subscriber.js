'use strict';

module.exports = {
	AMQP: {
		BIND: {
			id: 'ex-products',
			durable: false,
			type: 'topic',
			keys: [
				'find.user.*'
			],
			callback: function(data){
				console.log('DATA FROM EXCHANGE:');
				console.log(data.content.toString('utf8'));
			}
		}
	}
}