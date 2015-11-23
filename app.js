'use strict';

let _ = require('underscore');
let co = require('co');
let config = require('./src/config');
let replCallbacks = undefined;
let NodeAgent = require('./src/node-agent');
let sNode = new NodeAgent(config);
let EVENTS = sNode.constants.EVENTS;
let Chance = require('chance');
let chance = new Chance();

/**
 * BDS-ACCOUNT-FINDER
 */
if(config.TYPE === 'A'){
  let exchange = config.AMQP.EXCHANGE;
  let queue = config.AMQP.CONSUME_QUEUE.QUEUE;

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
      let msgJSON = JSON.parse(message.content.toString());
      // console.log(msgJSON);
      if(msgJSON.TYPE === 'REQUEST'){
        console.log('RECEIVED REQUEST');
        let query = {
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
        console.log('RECEIVED RESPONSE FROM ' + msgJSON.RESULT.ID);

        let response = {
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
      let msgJSON = JSON.parse(message.content.toString());
      // console.log(msgJSON);
      if(msgJSON.TYPE === 'REQUEST'){
        console.log('RECEIVED REQUEST');

        setTimeout(function(){
          let response = {
            TYPE: 'RESPONSE',
            QUERY: msgJSON.QUERY,
            RESULT: {
              ID: config.ID,
              DATA: chance.sentence()
            },
            CLIENT_DATA: msgJSON.CLIENT_DATA
          }

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
        let request = {
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
      let msgJSON = JSON.parse(message.content.toString());
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
      
  replCallbacks.push(function(data){
    console.log('REPL...');
  });
}

// app = require('koa')(),
// server = require('http').createServer(app.callback()),
// io = require('socket.io'),
// ioClient = require('socket.io-client'),
// config = require('./config'),
// port = config['PORT'] ? config['PORT'] : 5678,
// connectionAddress = config['CONNECT'] ? config['CONNECT'] : undefined,
// sockets = {},
// rmq = undefined,

// console.log(config);

// if(config.AMQP){
  
  // rmq =

  /*
  if(config.AMQP.EXCHANGE){
    replCallbacks.push(function(data){
      co(amqp.publish(config.AMQP.EXCHANGE, 'find.user.*', data)).catch(
        function(err){
          console.log('ERROR');
          console.log(err);
        }
      );
    });
  }

  if(config.AMQP.QUEUE){
    
  }

  if(config.AMQP.BIND){
    co(amqp.bindQueue(config.AMQP.BIND)).catch(
      function(err){
        console.log('ERROR');
        console.log(err);
      }
    );
  }
  */

  // if(config.AMQP.BIND){
  //   co(amqp.bindQueue(config.AMQP.BIND));
  // }
// }

/*

*/

// co()
// let testData = {
//   user: 'Nikos',
//   email: 'a@b.c'
// };

// co(rmq.publish(exProducts, 'bds.find.user', testData)).then(function(){
//   console.log('RABBITMQ READY');
// });

/*
sockets.input = io(server);
sockets.input.on('connection', function(sock){
  console.log('HELLO');
  sock.on('event', function(data){
    console.log('NEW MESSAGE: ');
    console.log(data);
  });
});

// sockets.input.on('event', function(data){
//   console.log('SE AKOUO');
// });

if(connectionAddress){
  sockets.output = ioClient.connect(connectionAddress);
  sockets.output.on('connect', function(){
    console.log('Connected at: ' + connectionAddress);
  })
}

app.use(function *(next){
  console.log('111111111');
  yield next;
});

app.use(function *(next){
  console.log('222222222');
  yield next;
});

app.use(function *(next){
  this.body = {
    data: 'Hello World'
  };
  yield next;
});

server.listen(port);

console.log('Listening at ' + port);

if(config['REPL']){
  (function dummyREPL(){
    readline.question("Type next command:", function(replData) {
      // console.log(replData);
      if(sockets.output){
        console.log('SENDING');
        sockets.output.emit('event', {data:replData});
      }
      dummyREPL();
    });
  })();
}
*/