const dotenv       = require('dotenv');
const gulp         = require('gulp');
const sass         = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const eslint       = require('gulp-eslint');
const terser       = require('gulp-terser');
const rename       = require('gulp-rename');
// const concat       = require('gulp-concat');
const nodemon      = require('gulp-nodemon');
const livereload   = require('gulp-livereload');
const noop         = require('gulp-noop');

sass.compiler = require('node-sass');
dotenv.config();


const isProd = process.env.ENV_MODE === 'development';

exports.css = done => {
  gulp.src('public/css/**/*.scss')
      .pipe(sass({ outputStyle: isProd ? 'compressed' : 'expanded' }).on('error', sass.logError))
      .pipe(autoprefixer({ cascade: false, grid: true }))
      .pipe(gulp.dest('public/css'))
      .pipe(livereload());

  done();
};
exports.css.displayName = 'css';

exports.js = done => {
  gulp.src(['public/js/**/*.js', '!public/js/**/*.min.js'])
      .pipe(eslint())
      .pipe(eslint.format())
      // .pipe(eslint.failAfterError())
      .pipe(isProd ? terser({ output: { quote_style: 1 }}) : noop())
      .pipe(rename({ extname: '.min.js' }))
      .pipe(gulp.dest('public/js'))
      .pipe(livereload());

  done();
};
exports.js.displayName = 'js';

exports.localhost = done => {
  nodemon({
    script: 'app.js',
    ext: 'js',
    ignore: [
      'node_modules/',
      'public/',
      'update-youtube-dl.js',
      'gulpfile.js'
    ],
    done
  });
};
exports.localhost.displayName = 'localhost';

exports.watch = done => {
  livereload.listen();

  gulp.watch('.env', dotenv.config);
  gulp.watch('public/css/**/*.scss', exports.css);
  gulp.watch(['public/js/**/*.js', '!public/js/**/*.min.js'], exports.js);

  exports.localhost(done);
};

exports.default = gulp.parallel(exports.css, exports.js);
