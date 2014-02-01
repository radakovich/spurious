var gulp = require('gulp');
var jasmine = require('gulp-jasmine');

gulp.task('test', function(){
    gulp.src('test/*.js')
        .pipe(jasmine());
});
