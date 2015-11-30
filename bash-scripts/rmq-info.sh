#!/bin/bash
echo 'CONNECTIONS';
rabbitmqctl list_connections;
echo 'CHANNELS';
rabbitmqctl list_channels;
echo 'VHOSTS';
rabbitmqctl list_vhosts;
echo 'QUEUES NAME DURABLE AUTO_DELETE MESSAGES READY UNACKNOWLEDGED PERSISTENT';
rabbitmqctl list_queues name durable auto_delete messages messages_ready messages_unacknowledged messages_persistent;
echo 'EXCHANGES NAME TYPE DURABLE AUTO_DELETE';
rabbitmqctl list_exchanges name type durable auto_delete;
echo 'BINDINGS SOURCE_NAME SOURCE_KIND DESTINATION_NAME DESTINATION_KIND ROUTING_KEY';
rabbitmqctl list_bindings source_name source_kind destination_name destination_kind routing_key;