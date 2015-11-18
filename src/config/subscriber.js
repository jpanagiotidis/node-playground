'use strict';

let data = require('./amqp-data');

module.exports = {
	AMQP: {
		BIND_QUEUE: [
			{
				EXCHANGE: data.EXCHANGE
				// KEYS: [
				// 	'find.user.*'
				// ],
				// CALLBACK: function(data){
				// 	console.log('DATA FROM EXCHANGE:');
				// 	console.log(data.content.toString('utf8'));
				// }
			}
		]
	}
}