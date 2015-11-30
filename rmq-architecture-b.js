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
const amqpData = require('./src/config/amqp-data');

if(config.TYPE === 'CLIENT'){
  let queueID;
  console.log('STARTING SIMPLE CLIENT');

  co(sNode.init()).then(
    function(){
      queueID = _.first(_.keys(sNode.amqp.queues));
      console.log('LISTENS AT QUEUE ' + queueID);

      startREPL();

      replCallbacks.push(function(data){
        const request = {
          CLIENT_ID: queueID,
          STATUS: 'PENDING',
          QUERY: {
            DATA: data
          }
        };

        co(sNode.amqp.publish(amqpData.EXCHANGE_ACCOUNT_FINDER_REQUESTS, '', JSON.stringify(request))).catch(
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
      console.log(msgJSON);
      // // console.log(msgJSON);
      // if(msgJSON.TYPE === 'RESPONSE'){
      //   console.log('RECEIVED RESPONSE');

      //   console.log(msgJSON.QUERY);
      //   console.log(msgJSON.RESULT);

      // }else{
      //   console.log('RECEIVED UNKNOWN FORMAT');
      //   queue.reject(message, false);
      // }
      queue.ack(message);
    }catch(err){
      console.log('ERROR');
      console.log(message.content.toString());
      console.log(err);
      queue.reject(message, false);
    }
  });
}else if(config.TYPE === 'PRODUCT'){
  console.log('PRODUCT CLIENT');
  co(sNode.init()).catch(
    function(err){
      console.error('ERROR');
      console.error(err);
    }
  );

  sNode.eventBus.on(EVENTS.AMQP.QUEUE.MESSAGE, function(queue, message){
    try{
      const msgJSON = JSON.parse(message.content.toString());
      console.log(msgJSON);
      if(msgJSON.QUERY){
        setTimeout(function(){
          const response = _.extend(msgJSON, {
            STATUS: 'OK',
            PRODUCT_ID: config.ID,
            RESULT: chance.sentence()
          });
          // {
          //   TYPE: 'RESPONSE',
          //   QUERY: msgJSON.QUERY,
          //   RESULT: {
          //     ID: config.ID,
          //     DATA: chance.sentence()
          //   },
          //   CLIENT_DATA: msgJSON.CLIENT_DATA
          // };

          co(
            sNode.amqp.publish(
              amqpData.EXCHANGE_ACCOUNT_FINDER_RESPONSES, 
              response.CLIENT_ID, 
              JSON.stringify(response)
            )
          ).catch(
            function(err){
              console.error('ERROR');
              console.error(err);
            }
          ); 
        }, 300);

        queue.ack(message);
      }
      // if(msgJSON.TYPE === 'REQUEST'){
      //   console.log('RECEIVED REQUEST ' + msgJSON.QUERY.DATA);


      // }else{
      //   console.log('RECEIVED UNKNOWN FORMAT');
      //   queue.reject(message, false);
      // }
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