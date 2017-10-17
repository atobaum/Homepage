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
    // gulp.src(src.main+'/js/*.js')
    // 	.pipe(uglify())
    // 	.pipe(gulp.dest(dist+'/js'));
    // gulp.src(src.bookshelf+'/js/*.js')
    //    .pipe(uglify())
    //    .pipe(gulp.dest(dist+'/js/bookshelf'));
    // gulp.src(src.wiki+'/js/*.js')
    // 	.pipe(uglify())
    // 	.pipe(gulp.dest(dist+'/js/wiki'));
    gulp.src('src/views/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('public/js'))
});

gulp.task('uglify-css', [], function(){
    // gulp.src(src.main+'/css/*.css')
    // 	.pipe(cleanCSS())
    // 	.pipe(gulp.dest(dist+'/css'));
    // gulp.src(src.bookshelf+'/css/*.css')
    //    .pipe(cleanCSS())
    //    .pipe(gulp.dest(dist+'/css/bookshelf'));
    // gulp.src(src.wiki +'/css/*.css')
    // 	.pipe(cleanCSS())
    // 	.pipe(gulp.dest(dist+'/css/wiki'));
    gulp.src('src/views/**/*.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest('public/css'))
});

gulp.task('copy-pug', function () {
    gulp.src('src/views/**/*.pug')
        .pipe(gulp.dest('dist/views'))
});

gulp.task('watch', function(){
    gulp.watch('src/views/**/*.js', ['uglify-js']);
    gulp.watch('src/views/**/*.css', ['uglify-css']);
    gulp.watch('src/**/*.ts', evt => {
        return gulp.src(evt.path)
            .pipe(tsProject())
            .js.pipe(gulp.dest(path.parse(evt.path).dir.replace('src', 'dist')));
    });

    gulp.watch(['src/**/*.js', '!src/views/**/*.js'], evt => {
        return gulp.src(evt.path)
            .pipe(gulp.dest(evt.path.replace('src', 'dist')));
    });

    gulp.watch('src/**/*.pug', ['copy-pug']);
});

gulp.task('default', ['typescript', 'copy-js', 'uglify-js', 'uglify-css', 'copy-pug', 'watch', 'start']);