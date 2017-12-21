"use strict";
let path = require('path');
let gulp = require('gulp');
let gutil = require('gulp-util');
let uglify = require('gulp-babel-minify');
let cleanCSS = require('gulp-clean-css');
let del = require('del');
let nodemon = require('gulp-nodemon');
let ts = require('gulp-typescript');
let tsProject = ts.createProject('tsconfig.json');
let webpack = require('webpack-stream');

gulp.task('start', [], function () {
    return nodemon({
        script: './bin/www',
        ext: 'js',
        watch: ['dist', '!dist/views']
    });
});
gulp.task('clean', () => {
    return del.sync(['dist', 'public/**/*', '!public/semantic', '!public/semantic/**/*', '!public/favicon.ico']);
});

//server side
gulp.task('typescript', () => {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest('dist'));
});
gulp.task('copy-js', () => {
    return gulp.src(['src/**/*.js', '!src/views/**/*.js'])
        .pipe(gulp.dest('dist'));
});

//client side
gulp.task('uglify-js', [], function(){
    gulp.src('src/views/**/*.js')
        .pipe(uglify({
            mangle: {
                keepClassName: true
            }
        }))
        .pipe(gulp.dest('public/js'))
});
gulp.task('copy-client-js', [], function () {
    gulp.src('src/views/**/*.js')
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
let webpackConfig = require('./webpack.config');
gulp.task('webpack', function () {
    gulp.src(webpackConfig.entry)
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(webpackConfig.output.path));
});

function changeDir(evt, from, to) {
    return path.parse(evt.path).dir.replace(from, to);
}
function notify(event) {
    gutil.log('File', gutil.colors.yellow(event.path), 'was', gutil.colors.magenta(event.type));
}

gulp.task('watch', function(){
    //client side
    gulp.watch('src/views/**/*.js', (evt) => {
        notify(evt);
        return gulp.src(evt.path)
            .pipe(gulp.dest(changeDir(evt, 'src' + path.sep + 'views', 'public' + path.sep + 'js')));
    });
    gulp.watch('src/views/**/*.css', (evt) => {
        notify(evt);
        return gulp.src(evt.path)
            .pipe(cleanCSS())
            .pipe(gulp.dest(changeDir(evt, 'src' + path.sep + 'views', 'public' + path.sep + 'css')));
    });
    gulp.watch('src/views/**/*.pug', (evt) => {
        notify(evt);
        return gulp.src(evt.path)
            .pipe(gulp.dest(changeDir(evt, 'src', 'dist')));
    });

    //server side
    gulp.watch('src/**/*.ts', evt => {
        notify(evt);
        return gulp.src(evt.path)
            .pipe(tsProject())
            .js.pipe(gulp.dest(path.parse(evt.path).dir.replace('src', 'dist')));
    });
    gulp.watch(['src/**/*.js', '!src/views/**/*.js'], evt => {
        notify(evt);
        return gulp.src(evt.path)
            .pipe(gulp.dest(evt.path.replace('src', 'dist')));
    });
});
gulp.task('compile', ['clean', 'typescript', 'copy-js', 'uglify-js', 'uglify-css', 'copy-pug']);

gulp.task('compile-dev', ['typescript', 'copy-js', 'copy-client-js', 'uglify-css', 'copy-pug']);

gulp.task('default', ['watch', 'start']);