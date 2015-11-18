module.exports = {
	EXCHANGE: {
		ID: 'aaaa-01',
		TYPE: 'fanout',
		OPTIONS: {
			durable: false,
		}
	},
	QUEUE: {
		ID: 'bds-user-finder-queue',
		OPTIONS: {
			durable: true,
			autoDelete: false
		}
	}
};