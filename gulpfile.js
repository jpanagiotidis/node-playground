'use strict';

let gulp = require('gulp'),
		exec = require('child_process').exec;

gulp.task('default', function() {
	console.log('GULP READY');
	// exec('ttab -w', function (err, stdout, stderr) {
 //    console.log(stdout);
 //    console.log(stderr);
 //    console.log(err);
 //    // cb(err);
 //  });
});

gulp.task('rmq-info', function(){
	exec('./bash-scripts/rmq-info.sh', function (err, stdout, stderr) {
		console.log('RABBITMQ INFO:');
    console.log(stdout);
    console.log('ERRORS:');
    console.log(stderr);
    console.log(err);
    // cb(err);
  });
});

gulp.task('rmq-delete-all', function(){
	exec('./bash-scripts/rmq-delete-all.sh', function (err, stdout, stderr) {
		console.log('RABBITMQ DELETE ALL:');
    console.log(stdout);
    console.log('ERRORS:');
    console.log(stderr);
    console.log(err);
    // cb(err);
  });
});