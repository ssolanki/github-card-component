'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');
var imagemin = require( 'gulp-imagemin' );
// var livereload = require('gulp-livereload');
var autoReload = require('gulp-auto-reload');
var cleanCSS = require('gulp-clean-css');
var paths = {
	html: './index.html',
  js: './main.js',
	sass: './sass/**/*.scss',
	fonts: './sass/fonts/**/*',
  images: './images/**/*'
};
// livereload.reload({
// 	reloadPage: 'index.html'
// })
var htmlInject = function() {
  return gutil.noop();
};
gulp.task('html', function() {
  gulp.src(paths.html)
    .pipe(htmlInject())      // inject <script> 
    .pipe(gulp.dest('build'));
});

gulp.task('reloader', function() {
	console.log("realoader working")
  // start a server for reloading 
  var reloader = autoReload();
  // copy the auto-reload.js script to 
  // the output 
  reloader.script()
    .pipe(gulp.dest('build'));
  // inject the script into html pages 
  htmlInject = reloader.inject;
  // start watching the output for changes 
  gulp.watch('build' + "/**/*", reloader.onChange);
});

gulp.task('sass', function () {
  return gulp.src(paths.sass)
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('build/css'))
    // .pipe(livereload());

});

// Copy all js 
gulp.task('js', function() {
  return gulp.src(paths.js)
    .pipe(gulp.dest('build/js'));
});

// Copy all static images 
gulp.task('images', function() {
  return gulp.src(paths.images)
    // Pass in options to the task 
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('build/images'));
});

// Copy all fonts
gulp.task('fonts', function() {
  return gulp.src(paths.fonts)
    // Pass in options to the task 
    .pipe(gulp.dest('build/fonts'));
});

// Rerun the task when a file changes 
gulp.task('watch',['reloader'] ,function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.html, ['html']);
  gulp.watch(paths.js, ['js']);
  gulp.watch(paths.images, ['images']);
});

gulp.task('default', ['watch','fonts', 'sass', 'js','images','html']);