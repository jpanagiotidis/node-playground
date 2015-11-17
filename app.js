'use strict';

let 
  _ = require('underscore'),
  co = require('co'),
  readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  }),
  // app = require('koa')(),
  // server = require('http').createServer(app.callback()),
  // io = require('socket.io'),
  // ioClient = require('socket.io-client'),
  config = require('./config'),
  // port = config['PORT'] ? config['PORT'] : 5678,
  // connectionAddress = config['CONNECT'] ? config['CONNECT'] : undefined,
  // sockets = {},
  amqp = undefined,
  replCallbacks = []
;

console.log(config);

if(config.AMQP){
  amqp = require('./src/rabbit-handler');

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

  // if(config.AMQP.BIND){
  //   co(amqp.bindQueue(config.AMQP.BIND));
  // }
}

if(config.REPL){
  (function dummyREPL(){
    readline.question("Type next command:", function(replData) {
      // console.log(replData);
      // if(sockets.output){
      //   console.log('SENDING');
      //   sockets.output.emit('event', {data:replData});
      // }
      _.each(replCallbacks, function(cb){
        if(_.isFunction(cb)){
          cb(replData);
        }
      });
      dummyREPL();
    });
  })();  
}

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