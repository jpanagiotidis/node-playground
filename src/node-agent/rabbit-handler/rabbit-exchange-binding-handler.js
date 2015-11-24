'use strict';

const _ = require('underscore');
const RabbitBaseHandler = require('./rabbit-base-handler');
const RabbitExchangeHandler = require('./rabbit-exchange-handler');

class RabbitExchangeBindingHandler extends RabbitBaseHandler{
  constructor(config){
    if(!config.SOURCE &&
      !config.DESTINATION){
      throw new Error('RabbitExchangeBindingHandler: Missing Configuration (SOURCE and/or DESTINATION missing).');
    }

    super(config);

    const self = this;

    self.exchangeSourceData = config.SOURCE;
    self.exchangeSource = undefined;
    self.exchangeDestinationData = config.DESTINATION;
    self.exchangeDestination = undefined;
    self.keys = config.KEYS ? config.KEYS : [''];
  }

  *init(){
    const self = this;

    yield super.init();
    
    self.exchangeSource = new RabbitExchangeHandler(
      _.extend(
        {
          connection: self.connection,
          channel: self.channel
        },
        self.exchangeSourceData
      )
    );
    yield self.exchangeSource.init();

    self.exchangeDestination = new RabbitExchangeHandler(
      _.extend(
        {
          connection: self.connection,
          channel: self.channel
        },
        self.exchangeDestinationData
      )
    );
    yield self.exchangeDestination.init();

    yield _.map(self.keys, function(key){
      return self.channel.bindExchange(self.exchangeDestination.id, self.exchangeSource.id, key);
    });
  }
}

module.exports = RabbitExchangeBindingHandler;