var gulp = require('gulp');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var nodemon = require('gulp-nodemon');
var browserSync =  require('browser-sync');

var dir = {
	main: './main',
	bookshelf: './bookshelf',
	wiki: './wiki'
};

var src = {
	main: './main/public',
	bookshelf: './bookshelf/public',
	wiki: dir.wiki + '/public'
};
var dist = 'public';
//...
gulp.task('browser-sync', function(){
    browserSync.init(null, {
        proxy: "http://localhost:3000",
        files: ["./public", dir.bookshelf+'/views', dir.main+'/views', dir.wiki+'/views'],
        port: 7000
    });
});

gulp.task('start', [], function(){
	return nodemon({
			script: './bin/www',
			ext: 'js',
			watch: [dir.bookshelf, dir.bookshelf+'/libs', dir.main, dir.main+'/libs', dir.wiki, dir.wiki+'/libs']
	});
});

gulp.task('uglify-js', [], function(){
	gulp.src(src.main+'/js/*.js')
		.pipe(uglify())
		.pipe(gulp.dest(dist+'/js'));
    gulp.src(src.bookshelf+'/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(dist+'/js/bookshelf'));
	gulp.src(src.wiki+'/js/*.js')
		.pipe(uglify())
		.pipe(gulp.dest(dist+'/js/wiki'));
});

gulp.task('uglify-css', [], function(){
	gulp.src(src.main+'/css/*.css')
		.pipe(cleanCSS())
		.pipe(gulp.dest(dist+'/css'));
	gulp.src(src.bookshelf+'/css/*.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest(dist+'/css/bookshelf'));
	gulp.src(src.wiki +'/css/*.css')
		.pipe(cleanCSS())
		.pipe(gulp.dest(dist+'/css/wiki'));

});

gulp.task('watch', function(){
	gulp.watch(src.main+'/js/*.js', ['uglify-js']);
	gulp.watch(src.main+'/css/*.css', ['uglify-css']);
	gulp.watch(src.bookshelf+'/js/*.js', ['uglify-js']);
	gulp.watch(src.bookshelf+'/css/*.css', ['uglify-css']);
	gulp.watch(src.wiki+'/js/*.js', ['uglify-js']);
	gulp.watch(src.wiki+'/css/*.css', ['uglify-css']);
});


gulp.task('default', ['uglify-js', 'uglify-css', 'watch', 'start']);