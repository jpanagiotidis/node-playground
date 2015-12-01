'use_strict';

module.exports = {
	EVENTS: {
		AMQP: {
			QUEUE: {
				MESSAGE_ARRIVED: 'amqp:queue:message'
			},
      MESSAGE: {
        CONFIRMATION_ACK: 'amqp:message:confirmation-ack',
        CONFIRMATION_NACK: 'amqp:message:confirmation-nack'
      }
		}
	}
};