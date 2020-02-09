const gulp = require('gulp');
const source = require('vinyl-source-stream');
const streamify = require('gulp-streamify');
const browserify = require('browserify');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const nodemon = require('gulp-nodemon');
const livereload = require('gulp-livereload');
const noop = require('gulp-noop');
const del = require('del');

sass.compiler = require('node-sass');

const isProd = process.env.NODE_ENV === 'production';

const css = done => {
  gulp
    .src('public/css/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(
      sass({ outputStyle: isProd ? 'compressed' : 'expanded' }).on(
        'error',
        sass.logError
      )
    )
    .pipe(autoprefixer({ cascade: false, grid: true }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public/css'))
    .pipe(livereload());

  done && done();
};

const js = done => {
  const bundle = browserify('./public/js/modules/main.js').bundle();

  bundle
    .pipe(source('bundle.js'))
    .pipe(!isProd ? streamify(sourcemaps.init()) : noop())
    .pipe(streamify(babel({ presets: ['@babel/env'] })))
    .pipe(isProd ? streamify(terser({ output: { quote_style: 1 } })) : noop())
    .pipe(!isProd ? streamify(sourcemaps.write('.')) : noop())
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
  livereload.listen({}, () => console.log('livereload is running...'));

  gulp.watch('public/css/**/*.scss', css);
  gulp.watch(
    ['public/js/**/*.js', '!public/js/bundle.js', '!public/js/**/*.min.js'],
    js
  );

  localhost();

  process.on('exit', done);
};

const clean = async done => {
  await del([
    'public/js/bundle.js',
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
