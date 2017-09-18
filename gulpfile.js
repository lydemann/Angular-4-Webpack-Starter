/// <binding />
var gulp = require('gulp');
var shell = require('gulp-shell');

gulp.task('default', function () {
    // place code for your default task here
    
});

gulp.task('set-dev-env', function () {
    return process.env.NODE_ENV = 'development';
});

gulp.task('build', ['set-dev-env'],
        shell.task([
            'npm run build'
    ]));