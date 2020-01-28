const gulp = require('gulp');
const eslint = require('gulp-eslint');
const terser = require('gulp-terser');
const sass = require('gulp-sass');
const stylelint = require('gulp-stylelint');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const nodemon = require('gulp-nodemon');
const livereload = require('gulp-livereload');
const noop = require('gulp-noop');

sass.compiler = require('node-sass');

// is production env
const isProd = true;

const css = () => {
  gulp
    .src('public/css/**/*.scss')
    .pipe(stylelint())
    .pipe(sass({ outputStyle: isProd ? 'compressed' : 'expanded' }).on('error', sass.logError))
    .pipe(autoprefixer({ cascade: false, grid: true }))
    .pipe(gulp.dest('public/css'))
    .pipe(livereload());
};

const js = () => {
  gulp
    .src(['public/js/**/*.js', '!public/js/**/*.min.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    // eslint-disable-next-line camelcase
    .pipe(isProd ? terser({ output: { quote_style: 1 } }) : noop())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('public/js'))
    .pipe(livereload());
};

const localhost = () => {
  nodemon({
    script: 'app.js',
    ext: 'js',
    ignore: ['node_modules/', 'public/', 'views/', 'tests/', 'update-youtube-dl.js', 'gulpfile.js']
  });
};

const watch = () => {
  livereload.listen();

  gulp.watch('public/css/**/*.scss', exports.css);
  gulp.watch(['public/js/**/*.js', '!public/js/**/*.min.js'], exports.js);

  exports.localhost();
};

exports.css = css;
exports.js = js;
exports.localhost = localhost;
exports.watch = watch;

exports.css.displayName = 'css';
exports.js.displayName = 'js';
exports.localhost.displayName = 'localhost';
exports.watch.displayName = 'watch';

exports.build = gulp.parallel(css, js);
exports.default = exports.build;
