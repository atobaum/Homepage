"use strict";
let path = require('path');
let gulp = require('gulp');
let uglify = require('gulp-uglify');
let cleanCSS = require('gulp-clean-css');
let nodemon = require('gulp-nodemon');
let ts = require('gulp-typescript');
let tsProject = ts.createProject('tsconfig.json');

gulp.task('typescript', () => {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest('dist'));
});

gulp.task('copy-js', () => {
    return gulp.src(['src/**/*.js', '!src/views/**/*.js'])
        .pipe(gulp.dest('dist'));
});

gulp.task('start', [], function(){
    return nodemon({
        script: './bin/www',
        ext: 'js',
        // watch: [dir.bookshelf, dir.bookshelf + '/libs', dir.main, dir.main + '/libs', dir.wiki, dir.wiki + '/libs', 'src']
        watch: ['dist']
    });
});

gulp.task('uglify-js', [], function(){
    gulp.src('src/views/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('public/js'))
});
gulp.task('uglify-css', [], function(){
    gulp.src('src/views/**/*.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest('public/css'))
});
gulp.task('copy-pug', function () {
    gulp.src('src/views/**/*.pug')
        .pipe(gulp.dest('dist/views'))
});

function changeDir(evt, from, to) {
    return path.parse(evt.path).dir.replace(from, to);
}

gulp.task('watch', function(){
    gulp.watch('src/views/**/*.js', (evt) => {
        return gulp.src(evt.path)
            .pipe(uglify())
            .pipe(gulp.dest(changeDir(evt, 'src' + path.sep + 'views', 'public' + path.sep + 'js')));
    });
    gulp.watch('src/views/**/*.css', (evt) => {
        return gulp.src(evt.path)
            .pipe(cleanCSS())
            .pipe(gulp.dest(changeDir(evt, 'src' + path.sep + 'views', 'public' + path.sep + 'css')));
    });
    gulp.watch('src/views/**/*.pug', (evt) => {
        return gulp.src(evt.path)
            .pipe(gulp.dest(changeDir(evt, 'src' + path.sep + 'views', 'views')));
    });

    gulp.watch('src/**/*.ts', evt => {
        return gulp.src(evt.path)
            .pipe(tsProject())
            .js.pipe(gulp.dest(path.parse(evt.path).dir.replace('src', 'dist')));
    });
    gulp.watch(['src/**/*.js', '!src/views/**/*.js'], evt => {
        return gulp.src(evt.path)
            .pipe(gulp.dest(evt.path.replace('src', 'dist')));
    });

});

gulp.task('default', ['typescript', 'copy-js', 'uglify-js', 'uglify-css', 'copy-pug', 'watch', 'start']);