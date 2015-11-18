var optionsExchangeDev = {
	durable: false,
	autoDelete: true
};

module.exports = {
	EXCHANGE_ACCOUNT_FINDER: {
		ID: 'accountFinder',
		TYPE: 'fanout',
		OPTIONS: optionsExchangeDev
	},
	EXCHANGE_P1: {
		ID: 'p1',
		TYPE: 'topic',
		OPTIONS: optionsExchangeDev
	},
	EXCHANGE_P2: {
		ID: 'p2',
		TYPE: 'fanout',
		OPTIONS: optionsExchangeDev
	},
	EXCHANGE_P3: {
		ID: 'p3',
		TYPE: 'direct',
		OPTIONS: optionsExchangeDev
	},
	QUEUE: {
		ID: 'bds-user-finder-queue',
		OPTIONS: {
			durable: true,
			autoDelete: false
		}
	}
};