'use strict';

let 
  _ = require('underscore'),
  readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  }),
  app = require('koa')(),
  server = require('http').createServer(app.callback()),
  io = require('socket.io'),
  ioClient = require('socket.io-client'),
  args = processArgs(),
  port = args['PORT'] ? args['PORT'] : 5678,
  connectionAddress = args['CONNECT'] ? args['CONNECT'] : undefined,
  sockets = {}
;

console.log(args);

sockets.input = io(server);
sockets.input.on('connection', function(sock){
  console.log('HELLO');
  sock.on('event', function(data){
    console.log('SE AKOUO: ');
    console.log(data);
  });
});

// sockets.input.on('event', function(data){
//   console.log('SE AKOUO');
// });

if(connectionAddress){
  sockets.output = ioClient.connect(connectionAddress);
  sockets.output.on('connect', function(){
    console.log('fasdfasdf');
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

app.use(function *(){
  this.body = {
    data: 'Hello World'
  };
});

// if(connectionAddress){
//   io.connect(connectionAddress, function(){
//     console.log('connected to ' + connectionAddress);
//   });
// }

server.listen(port);

console.log('Listening at ' + port);

function processArgs(){
  let out = {};

  _.each(process.argv, function(value){
    value = value.split('=');
    value.length > 1 ? out[value[0]] = value[1] : _.noop();
  });

  return out;
}

function test(){
  console.log('test test test');
}

(function dummyREPL(){
  readline.question("Type next command:", function(replData) {
    console.log(replData);
    if(sockets.output){
      console.log('SENDING');
      sockets.output.emit('event', {data:replData});
    }
    dummyREPL();
  });
})();