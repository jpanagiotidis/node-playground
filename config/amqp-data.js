module.exports = {
	EXCHANGE: {
		ID: 'aaaa-01',
		DURABLE: false,
		TYPE: 'fanout'		
	},
	QUEUE: {
		ID: 'bds-user-finder-queue',
		OPTIONS: {
			durable: true,
			autoDelete: false
		},
		CALLBACK: function(data){
			console.log('QUEUE CB');
			console.log(data);
		}
	}
};