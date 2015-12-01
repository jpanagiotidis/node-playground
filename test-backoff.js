'use strict';

var backoff = require('backoff');

var fibonacciBackoff = backoff.fibonacci({
    randomisationFactor: 0,
    initialDelay: 50,
    maxDelay: 5*60*1000
});

// fibonacciBackoff.failAfter(10);

fibonacciBackoff.on('backoff', function(number, delay) {
    // Do something when backoff starts, e.g. show to the
    // user the delay before next reconnection attempt.
    console.log(number + ' ' + delay + 'ms');
});

fibonacciBackoff.on('ready', function(number, delay) {
    // Do something when backoff ends, e.g. retry a failed
    // operation (DNS lookup, API call, etc.). If it fails
    // again then backoff, otherwise reset the backoff
    // instance.
    fibonacciBackoff.backoff();
});

fibonacciBackoff.on('fail', function() {
    // Do something when the maximum number of backoffs is
    // reached, e.g. ask the user to check its connection.
    console.log('fail');
});

fibonacciBackoff.backoff();