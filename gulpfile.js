let gulp = require('gulp');
let scss = require('gulp-sass')(require('sass'));
let browserify = require('gulp-browserify');
let browsync = require('browser-sync');
const { stream } = require('browser-sync');
let clean = require('gulp-clean');


gulp.task('clean', () => gulp.src('./dest')
    .pipe(clean()))


gulp.task('html', () =>
    gulp.src('src/**/*.html')
        .pipe(gulp.dest('dest/.'))
        .pipe(stream())
)


gulp.task('styles', () =>
    gulp.src('src/styles/**/*.scss')
        .pipe(scss())
        .pipe(gulp.dest('dest/styles/.'))
        .pipe(stream())
)


gulp.task('js', () =>
    gulp.src('src/js/index.js')
        .pipe(browserify())
        .pipe(gulp.dest('dest/js/.'))
        .pipe(stream())
)


gulp.task('img', () =>
    gulp.src('src/img/**/*.*')
        .pipe(gulp.dest('dest/img/.'))
        .pipe(stream())
)


gulp.task('build', gulp.parallel('html', 'styles', 'js', 'img'))


gulp.task('clean-build', gulp.series('clean', 'build'))


gulp.task('watch', () => {
    gulp.watch('src/**/*.html', gulp.series('html'));
    gulp.watch('src/styles/**/*.scss', gulp.series('styles'));
    gulp.watch('src/js/**/*.js', gulp.series('js'));
    gulp.watch('src/img/**/*.*', gulp.series('img'));
})


gulp.task('sync', () => {
    browsync.init({
        server: { baseDir: 'dest/.' }
    })
})


gulp.task('build-&-sync', gulp.series('clean-build', 'sync'))


gulp.task('default', gulp.parallel('build-&-sync', 'watch'))