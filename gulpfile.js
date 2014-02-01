var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

gulp.task('test', function(){
    gulp.src('test/*.js')
        .pipe(jasmine());
});

gulp.task('lint', function(){
    gulp.src(['test/*.js', 'lib/*.js', '*js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('default', ['test', 'lint']);
