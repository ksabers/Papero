var gulp = require('gulp');
var uglify = require('gulp-uglify');

gulp.task('minify', function () {

    return gulp.src("wwwroot/lib/jquery-validation/dist/jquery.validate.js")
        .pipe(uglify())
        .pipe(gulp.dest("wwwroot/lib/jquery-validation/dist/jquery.validate.min.js"));

});