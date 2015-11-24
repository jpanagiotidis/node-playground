'use strict';

const _ = require('underscore');
const co = require('co');
const config = require('./src/config');
let replCallbacks;
const NodeAgent = require('./src/node-agent');
const sNode = new NodeAgent(config);
const EVENTS = sNode.constants.EVENTS;
const Chance = require('chance');
const chance = new Chance();

/**
 * BDS-ACCOUNT-FINDER
 */
if(config.TYPE === 'A'){
  const exchange = config.AMQP.EXCHANGE;
  // let queue = config.AMQP.CONSUME_QUEUE.QUEUE;

  console.log('STARTING BDS-ACCOUNT-FINDER');
  co(sNode.init()).catch(
    function(err){
      console.error('ERROR');
      console.error(err);
    }
  );

  sNode.eventBus.on(EVENTS.AMQP.QUEUE.MESSAGE, function(queue, message){
    // console.log(message.content.toString());
    try{
      const msgJSON = JSON.parse(message.content.toString());
      // console.log(msgJSON);
      if(msgJSON.TYPE === 'REQUEST'){
        console.log('RECEIVED REQUEST');
        const query = {
          TYPE: 'REQUEST',
          RESPOND_TO: {
            TYPE: 'QUEUE',
            ID: queue.ID
          },
          QUERY: msgJSON.QUERY,
          CLIENT_DATA: {
            MESSAGE: message,
            RESPOND_TO: msgJSON.RESPOND_TO
          }
        };

        co(sNode.amqp.publish(exchange, '', JSON.stringify(query))).catch(
          function(err){
            console.error('ERROR');
            console.error(err);
          }
        );
        queue.ack(message);
      }else if(msgJSON.TYPE === 'RESPONSE'){
        console.log('RECEIVED RESPONSE FROM ' + msgJSON.RESULT.ID + ' FOR QUERY ' + msgJSON.QUERY.DATA);

        const response = {
          TYPE: 'RESPONSE',
          QUERY: msgJSON.QUERY,
          RESULT: msgJSON.RESULT
        };

        if(msgJSON.CLIENT_DATA.RESPOND_TO.TYPE === 'QUEUE'){
          co(sNode.amqp.publish('', msgJSON.CLIENT_DATA.RESPOND_TO.ID, JSON.stringify(response))).catch(
            function(err){
              console.error('ERROR');
              console.error(err);
            }
          );
        }else if(msgJSON.CLIENT_DATA.RESPOND_TO.TYPE === 'EXCHANGE'){
          co(sNode.amqp.publish(msgJSON.CLIENT_DATA.RESPOND_TO.ID, msgJSON.CLIENT_DATA.RESPOND_TO.KEY, JSON.stringify(response))).catch(
            function(err){
              console.error('ERROR');
              console.error(err);
            }
          );
        }else{

        }

        queue.ack(message);
      }else{
        console.log('RECEIVED UNKNOWN FORMAT');

        queue.reject(message, false);
      }
    }catch(err){
      console.log('ERROR');
      console.log(message.content.toString());
      console.log(err);
      queue.reject(message, false);
    }
  });
}

/**
 * PRODUCT-CLIENT
 */
if(config.TYPE === 'B'){
  co(sNode.init()).catch(
    function(err){
      console.error('ERROR');
      console.error(err);
    }
  );

  sNode.eventBus.on(EVENTS.AMQP.QUEUE.MESSAGE, function(queue, message){
    try{
      const msgJSON = JSON.parse(message.content.toString());
      // console.log(msgJSON);
      if(msgJSON.TYPE === 'REQUEST'){
        console.log('RECEIVED REQUEST ' + msgJSON.QUERY.DATA);

        setTimeout(function(){
          const response = {
            TYPE: 'RESPONSE',
            QUERY: msgJSON.QUERY,
            RESULT: {
              ID: config.ID,
              DATA: chance.sentence()
            },
            CLIENT_DATA: msgJSON.CLIENT_DATA
          };

          co(sNode.amqp.publish('', 'bds-user-finder-queue', JSON.stringify(response))).catch(
            function(err){
              console.error('ERROR');
              console.error(err);
            }
          ); 
        }, 300);

        queue.ack(message);
      }else{
        console.log('RECEIVED UNKNOWN FORMAT');
        queue.reject(message, false);
      }
    }catch(err){
      console.log('ERROR');
      console.log(message.content.toString());
      console.log(err);
      queue.reject(message, false);
    }
  });
}

/**
 * A simple asking client
 */
if(config.TYPE === 'C'){
  let queueID;
  console.log('STARTING SIMPLE CLIENT');

  co(sNode.init()).then(
    function(){
      queueID = _.first(_.keys(sNode.amqp.queues));
      console.log('LISTENS AT QUEUE ' + queueID);

      startREPL();

      replCallbacks.push(function(data){
        const request = {
          TYPE: 'REQUEST',
          RESPOND_TO: {
            TYPE: 'QUEUE',
            ID: queueID
          },
          QUERY: {
            DATA: data
          }
        };

        co(sNode.amqp.publish('', 'bds-user-finder-queue', JSON.stringify(request))).catch(
          function(err){
            console.error('ERROR');
            console.error(err);
          }
        );
      });
    }
  ).catch(
    function(err){
      console.error('ERROR');
      console.error(err);
    }
  );

  sNode.eventBus.on(EVENTS.AMQP.QUEUE.MESSAGE, function(queue, message){
    try{
      const msgJSON = JSON.parse(message.content.toString());
      // console.log(msgJSON);
      if(msgJSON.TYPE === 'RESPONSE'){
        console.log('RECEIVED RESPONSE');

        console.log(msgJSON.QUERY);
        console.log(msgJSON.RESULT);

        queue.ack(message);
      }else{
        console.log('RECEIVED UNKNOWN FORMAT');
        queue.reject(message, false);
      }
    }catch(err){
      console.log('ERROR');
      console.log(message.content.toString());
      console.log(err);
      queue.reject(message, false);
    }
  });
}

function startREPL(){
  replCallbacks = require('./src/dummy-repl').callbacks;
      
  replCallbacks.push(function(){
    console.log('REPL...');
  });
}