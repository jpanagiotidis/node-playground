'use strict';

let co = require('co');
let config = require('./src/config');
let replCallbacks = undefined;
let NodeAgent = require('./src/node-agent');
let sNode = new NodeAgent(config);
let EVENTS = sNode.constants.EVENTS;

global.ROOT = __dirname;

co(sNode.init()).then(
  function(){
    if(config.REPL){
      replCallbacks = require('./src/dummy-repl').callbacks;
      
      replCallbacks.push(function(data){
        console.log('REPL...');
      });

      if(config.AMQP.EXCHANGE){
        let exchange = config.AMQP.EXCHANGE;
        replCallbacks.push(function(data){
          console.log('SENDING MESSAGE THROUGH EXCHANGE ' + exchange.ID);
          co(sNode.amqp.publish(exchange, '', data)).catch(
            function(err){
              console.error('ERROR');
              console.error(err);
            }
          );
        });
      }
    }
  }
).catch(
  function(err){
    console.error('ERROR');
    console.error(err);
  }
);

sNode.eventBus.on(EVENTS.AMQP.QUEUE.MESSAGE, function(queue, message){
  console.log('RECEIVED QUEUE MESSAGE ' + queue.id);
  console.log(message.content.toString());
  queue.ack(message);
  if(config.TYPE === 'B'){
    co(sNode.amqp.publish('', 'bds-user-finder-queue', 'DADA')).catch(
      function(err){
        console.error('ERROR');
        console.error(err);
      }
    );
  }
});

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