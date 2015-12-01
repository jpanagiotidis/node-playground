'use_strict';

module.exports = {
	EVENTS: {
		AMQP: {
      STATE: {
        CONNECTED: 'amqp:state:connected',
        DISCONNECTED: 'amqp:state:disconnected'
      },
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