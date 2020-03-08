const gulp = require('gulp');
const browserify = require('browserify');
const tsify = require('tsify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const terser = require('gulp-terser');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const ejs = require('gulp-ejs');
const htmlmin = require('gulp-htmlmin');
const livereload = require('gulp-livereload');
const rename = require('gulp-rename');
const noop = require('gulp-noop');
const path = require('path');
const { spawn } = require('child_process');
const { rmdir } = require('fs').promises;

const isProd = process.env.NODE_ENV === 'production';

const srcDir = path.join(__dirname, 'src', 'client');
const outDir = path.join(__dirname, 'dist', 'client');

sass.compiler = require('sass');

ejs.__EJS__.delimiter = '?';

const html = done => {
  gulp
    .src(`${srcDir}/ejs/*.ejs`)
    .pipe(ejs().on('error', console.error))
    .pipe(isProd ? htmlmin({ collapseWhitespace: true }) : noop())
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest(outDir));

  done && done();
};

const css = done => {
  gulp
    .src(`${srcDir}/scss/*.scss`)
    .pipe(!isProd ? sourcemaps.init() : noop())
    .pipe(
      sass({ outputStyle: isProd ? 'compressed' : 'expanded' }).on(
        'error',
        sass.logError
      )
    )
    .pipe(autoprefixer({ cascade: false, grid: true }))
    .pipe(!isProd ? sourcemaps.write('.') : noop())
    .pipe(gulp.dest(`${outDir}/assets/css`))
    .pipe(!isProd ? livereload() : noop());

  done && done();
};

const js = done => {
  browserify()
    .add('./src/client/ts/main.ts')
    .exclude('./src/server/**/*')
    .plugin(tsify, {
      rootDir: './src/client',
      target: 'es5',
      module: 'commonjs',
      noImplicitAny: true,
      removeComments: true
    })
    .bundle()
    .on('error', err => console.error(err.message))
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(!isProd ? sourcemaps.init() : noop())
    .pipe(isProd ? terser({ output: { quote_style: 1 } }) : noop())
    .pipe(!isProd ? sourcemaps.write('.') : noop())
    .pipe(gulp.dest(`${outDir}/assets/js`))
    .pipe(!isProd ? livereload() : noop());

  done && done();
};

const favicons = done => {
  gulp
    .src(`${srcDir}/favicons/**/*`)
    .pipe(gulp.dest(`${outDir}/assets/favicons`));

  done && done();
};

const fonts = done => {
  gulp.src(`${srcDir}src/fonts/**/*`).pipe(gulp.dest(`${outDir}/assets/fonts`));

  done && done();
};

const build = gulp.parallel(html, css, js, favicons, fonts);

const localhost = done => {
  spawn(
    path.join(__dirname, 'node_modules', '.bin', 'nodemon'),
    ['./dist/server/app.js'],
    {
      stdio: ['ignore', 'inherit', 'inherit'],
      shell: true
    }
  );

  done && done();
};

const watch = done => {
  livereload.listen({}, () => console.log('livereload is running...'));

  gulp.watch(`${srcDir}/scss/**/*`, css);
  gulp.watch(`${srcDir}/ts/**/*`, js);

  localhost();

  process.on('exit', done);
};

const clean = async done => {
  await rmdir(path.join(__dirname, 'dist'));

  done && done();
};

exports.html = html;
exports.css = css;
exports.js = js;
exports.favicons = favicons;
exports.fonts = fonts;
exports.build = build;
exports.localhost = localhost;
exports.watch = watch;
exports.clean = clean;

exports.html.lengthdisplayName = 'html';
exports.css.displayName = 'css';
exports.js.displayName = 'js';
exports.favicons.displayName = 'favicons';
exports.fonts.displayName = 'fonts';
exports.build.displayName = 'build';
exports.localhost.displayName = 'localhost';
exports.watch.displayName = 'watch';
exports.clean.displayName = 'clean';

exports.default = exports.build;
