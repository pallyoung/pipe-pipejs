var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('test',function(){
    gulp.src('./src/index.js')
    .pipe(rename('pipejs.js'))
    .pipe(gulp.dest('./test'))
});
gulp.task('release',function(){
    gulp.src('./src/index.js')
    .pipe(rename('pipejs.js'))
    .pipe(gulp.dest('./dest'))
    .pipe(rename('pipejs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dest'));
});

function uglifyJs(){

}