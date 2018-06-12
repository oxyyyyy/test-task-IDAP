var gulp = require('gulp'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync').create(),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglifyjs'),
	cssnano = require('gulp-cssnano'),
	rename = require('gulp-rename'),
	concatCss = require('gulp-concat-css'),
	imagemin = require('gulp-imagemin'),
	pug = require('gulp-pug'),
	del = require('del');

// NOTE: yarn

// Tasks! ----------------------------------------------------------------------------------------------------
gulp.task('browser-sync', function () {
	browserSync.init({
		// NOTE: if a localhost - proxy: "first"
		// NOTE: if not - server: {baseDir: 'src'}
		server: {
			baseDir: 'src'
		}
	});
});

gulp.task('sass', function () {
	return gulp.src('src/sass/**/*.sass')
		.pipe(sass())
		.pipe(gulp.dest('src/css'));
});

gulp.task('scripts', function () {
	return gulp.src([])
		.pipe(concat('bundle.libs.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('src/js'));
});

gulp.task('concatCssTaskLibs', function () {
	return gulp.src(['./node_modules/uikit/dist/css/uikit.min.css'])
		.pipe(concatCss('bundle.libs.css'))
		.pipe(gulp.dest('src/css'));
});

gulp.task('minCss', ['sass'], function () {
	return gulp.src(['src/css/main.css'])
		.pipe(cssnano())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('src/css'))
		.pipe(browserSync.stream());
});

gulp.task('minCssLibs', ['concatCssTaskLibs'], function () {
	return gulp.src(['src/css/bundle.libs.css'])
		.pipe(cssnano())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('src/css'));
});

gulp.task('pug', function buildHtml() {
	return gulp.src('src/pug/index.pug')
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest('src'))
		.pipe(browserSync.stream());
});

gulp.task('clean', function () {
	return del.sync('dist/**/*');
});
// -----------------------------------------------------------------------------------------------------------

// Watch! ----------------------------------------------------------------------------------------------------
gulp.task('default', ['browser-sync', 'minCss', 'minCssLibs', 'pug'], function () {
	gulp.watch('src/sass/**/*.sass', ['minCss']);
	gulp.watch('src/pug/*.pug', ['pug']);
	gulp.watch('src/js/**/*.js', browserSync.reload);
});
// -----------------------------------------------------------------------------------------------------------

// Optimize images! ------------------------------------------------------------------------------------------
gulp.task('cleanDistImg', function () {
	return del.sync('dist/img/**/*');
});

gulp.task('imgOpti', ['cleanDistImg'], () =>
	gulp.src('src/img/**/*')
		.pipe(imagemin([
			imagemin.gifsicle({
				interlaced: true
			}),
			imagemin.jpegtran({
				progressive: true
			}),
			imagemin.optipng({
				optimizationLevel: 5
			}),
			imagemin.svgo({
				plugins: [{
					removeViewBox: true
				}]
			})
		]))
		.pipe(gulp.dest('dist/img'))
);
// -----------------------------------------------------------------------------------------------------------

// Bulid! ----------------------------------------------------------------------------------------------------
gulp.task('build', ['clean', 'scripts', 'minCss', 'minCssLibs', 'pug'], function () {

	var buildCss = gulp.src([
		'src/css/main.min.css',
		'src/css/bundle.libs.min.css'
	])
		.pipe(gulp.dest('dist/css'));

	var buildJs = gulp.src([
		'src/js/common.js',
		'src/js/bundle.libs.min.js'
	])
		.pipe(gulp.dest('dist/js'));

	var buildHtmlPhp = gulp.src([
		'src/*.html',
		'src/*.php'
	])
		.pipe(gulp.dest('dist/'));

});
// -----------------------------------------------------------------------------------------------------------
