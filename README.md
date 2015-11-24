#Node Playground
A place where everything is allowed!!!

##RabbitMQ architectures
###Start the client
```
nodemon rmq-architecture.js CONFIG=config-client
```

###Start the account finder
```
nodemon rmq-architecture.js CONFIG=config-bds-account-finder
```

###Start the product clients
```
nodemon rmq-architecture.js CONFIG=config-product-client-a
nodemon rmq-architecture.js CONFIG=config-product-client-b
nodemon rmq-architecture.js CONFIG=config-product-client-c
```