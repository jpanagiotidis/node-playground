'use strict';

let gulp = require('gulp'),
		exec = require('child_process').exec;

gulp.task('default', function() {
	console.log('GULP READY');
	exec('ttab -w', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    console.log(err);
    // cb(err);
  });
});