const gulp = require('gulp');
const terser = require('gulp-terser');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const nodemon = require('gulp-nodemon');
const livereload = require('gulp-livereload');
const noop = require('gulp-noop');
const del = require('del');

sass.compiler = require('node-sass');

const isProd = process.env.NODE_ENV === 'production';

const css = done => {
  gulp
    .src('public/css/**/*.scss')
    .pipe(
      sass({ outputStyle: isProd ? 'compressed' : 'expanded' }).on(
        'error',
        sass.logError
      )
    )
    .pipe(autoprefixer({ cascade: false, grid: true }))
    .pipe(gulp.dest('public/css'))
    .pipe(livereload());

  done && done();
};

const js = done => {
  gulp
    .src(['public/js/**/*.js', '!public/js/**/*.min.js'])
    .pipe(isProd ? terser({ output: { quote_style: 1 } }) : noop())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('public/js'))
    .pipe(livereload());

  done && done();
};

const localhost = done => {
  nodemon({
    script: 'app.js',
    ext: 'js',
    ignore: [
      'node_modules/',
      'public/',
      'views/',
      'tests/',
      'update-youtube-dl.js',
      'gulpfile.js'
    ]
  });

  done && done();
};

const watch = done => {
  livereload.listen();

  gulp.watch('public/css/**/*.scss', exports.css);
  gulp.watch(['public/js/**/*.js', '!public/js/**/*.min.js'], exports.js);

  localhost(done);

  done && done();
};

const clean = async done => {
  await del([
    'public/js/*.min.js',
    'public/js/*.js.map',
    'public/css/*.css',
    'public/css/*.css.map'
  ]);

  done && done();
};

exports.css = css;
exports.js = js;
exports.localhost = localhost;
exports.watch = watch;
exports.clean = clean;

exports.css.displayName = 'css';
exports.js.displayName = 'js';
exports.localhost.displayName = 'localhost';
exports.watch.displayName = 'watch';
exports.clean.displayName = 'clean';

exports.default = exports.build = gulp.parallel(css, js);
