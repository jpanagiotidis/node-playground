'use strict';

const app = require('koa')();
const server = require('http').createServer(app.callback());
const io = require('socket.io');
const ioClient = require('socket.io-client');
const config = require('./src/config');
const port = config.PORT ? config.PORT : 5678;
const connectionAddress = config['CONNECT'] ? config['CONNECT'] : undefined;
const sockets = {};
const NodeAgent = require('./src/node-agent');
const sNode = new NodeAgent(config);

console.log(config);

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
  const replCallbacks = require('./src/dummy-repl').callbacks;

  replCallbacks.push(function(){
    console.log('REPL...');
  });

  replCallbacks.push(function(data){
    if(sockets.output){
      console.log('SENDING');
      sockets.output.emit('event', {
        data: data
      });
    }
  });
}
/*
*/