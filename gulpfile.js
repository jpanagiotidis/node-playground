'use strict';

let gulp = require('gulp');
let gutil = require('gulp-util');
let exec = require('child_process').exec;
let jshint = require('gulp-jshint');

let config = {
  paths: {
    js: ['./*.js', './src/**/*.js']
  }
};

gulp.task('default', function() {
  gutil.log('GULP READY');
  gulp.watch(config.paths.js, [
    'lint'
  ]);
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

gulp.task('lint', function() {
  return gulp.src(config.paths.js)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});