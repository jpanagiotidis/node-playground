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

  let sendRequest = function(data){
    const request = {
      CLIENT_ID: queueID,
      STATUS: 'PENDING',
      QUERY: {
        DATA: data
      }
    };

    co(
      sNode.amqp.publish(
        amqpData.EXCHANGE_ACCOUNT_FINDER_REQUESTS, 
        '', 
        JSON.stringify(request)
      )
    ).catch(
      function(err){
        console.error('ERROR');
        console.error(err);
      }
    );
  }

  co(sNode.init()).then(
    function(){
      queueID = _.first(_.keys(sNode.amqp.queues));
      console.log('LISTENS AT QUEUE ' + queueID);

      startREPL();

      setInterval(
        function(){
          sendRequest('123');
        },
        100
      );

      // replCallbacks.push(function(data){
      //   sendRequest(data);
      // });
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

  class RequestsHandler{
    constructor(){
      this.reqs = {};
    }

    add(id, request){
      this.reqs[id] = request;
    }

    get(id){
      return this.reqs[id];
    }

    remove(id){
      delete this.reqs[id].message;
      delete this.reqs[id].messageJSON;
      delete this.reqs[id].queue;
      delete this.reqs[id].response;
      delete this.reqs[id];
    }
  }

  const reqs = new RequestsHandler();
  const responses = {};

  co(sNode.init()).catch(
    function(err){
      console.error('ERROR');
      console.error(err);
    }
  );

  let respondToClient = function(responseID){
    const req = reqs.get(responseID);
    if(req){
      co(
        sNode.amqp.publish(
          amqpData.EXCHANGE_ACCOUNT_FINDER_RESPONSES, 
          req.response.CLIENT_ID, 
          JSON.stringify(req.response)
        )
      ).catch(
        function(err){
          console.error('ERROR on respondToClient');
          console.error(err);
        }
      );
    }else{
      console.log('ERROR - tried to respont to undefined request!!!');
    }

    // responses[responseID].queue.ack(responses[responseID].message);
  }

  sNode.eventBus.on(EVENTS.AMQP.QUEUE.MESSAGE, function(queue, message){
    try{
      const msgJSON = JSON.parse(message.content.toString());
      if(msgJSON.QUERY){
        const rID = chance.string({
          length: 32,
          pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        });

        const response = _.extend(msgJSON, {
          RESPONSE_ID: rID,
          STATUS: 'OK',
          PRODUCT_ID: config.ID,
          RESULT: chance.sentence()
        });

        reqs.add(
          rID, 
          {
            message: message,
            messageJSON: msgJSON,
            response: response,
            queue: queue
          }
        );

        respondToClient(rID);
      }
    }catch(err){
      console.log('ERROR ON MESSAGE RECEIVED');
      console.log(message.content.toString());
      console.log(err);
      queue.reject(message, false);
    }
  });

  sNode.eventBus.on(EVENTS.AMQP.MESSAGE.CONFIRMATION_ACK, function(message){
    const msgJSON = JSON.parse(message);
    const req = reqs.get(msgJSON.RESPONSE_ID);
    if(req){
      req.queue.ack(req.message);
      reqs.remove(msgJSON.RESPONSE_ID);
    }else{
      console.log('ERROR - tried to ack undefined response');
    }
    console.log(process.memoryUsage());
  });

  sNode.eventBus.on(EVENTS.AMQP.MESSAGE.CONFIRMATION_NACK, function(message){
    const msgJSON = JSON.parse(message);
    respondToClient(msgJSON.RESPONSE_ID);
  });
}

function startREPL(){
  replCallbacks = require('./src/dummy-repl').callbacks;
      
  replCallbacks.push(function(){
    console.log('REPL...');
  });
}