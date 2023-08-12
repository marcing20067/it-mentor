const { src, dest, series, parallel, watch } = require("gulp");
const sass = require("gulp-dart-sass");
const cssnano = require("gulp-cssnano");
const autoprefixer = require("gulp-autoprefixer");
const rename = require("gulp-rename");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const sourcemaps = require("gulp-sourcemaps");
const clean = require("gulp-clean");
const browserSync = require("browser-sync").create();
const kit = require("gulp-kit-2");
const reload = browserSync.reload;
const ghpages = require('gh-pages');
const paths = {
  img: "./src/img/**",
  html: "./src/html/**/*.kit",
  sass: "./src/sass/**/*.scss",
  js: "./src/js/**/*.js",
  imgDest: "./dist/img",
  sassDest: "./dist/css",
  jsDest: "./dist/js",
  dist: "./dist",
};

function handleKits(done) {
  src(paths.html)
    .pipe(kit())
    .pipe(dest(paths.dist))
    .on("error", (e) => console.log(e));
  done();
}

function sassCompiler(done) {
  src(paths.sass)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(cssnano())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write())
    .pipe(dest(paths.sassDest));
  done();
}

function javaScript(done) {
  src(paths.js)
    .pipe(sourcemaps.init())
    .pipe(babel({ presets: ["@babel/env"] }))
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write())
    .pipe(dest(paths.jsDest));
  done();
}

function cleanStuff(done) {
  src(paths.dist, { read: false }).pipe(clean());
  done();
}

function startBrowserSync(done) {
  browserSync.init({
    server: {
      baseDir: paths.dist,
    },
  });

  done();
}

function watchForChanges(done) {
  watch("./dist/*.html").on("change", reload);
  watch(
    [paths.html, paths.sass, paths.js],
    parallel(handleKits, sassCompiler, javaScript)
  ).on("change", reload);
  done();
}

function moveImagesToDist(done) {
  src(paths.img).pipe(dest(paths.imgDest));
  done();
}

function ghPages(done) {
  ghpages.publish('dist', done);
}

const mainFunctions = parallel(sassCompiler, javaScript, moveImagesToDist);
exports.cleanStuff = cleanStuff;
exports.default = series(mainFunctions, startBrowserSync, watchForChanges);
exports.build = parallel(handleKits, mainFunctions);
exports.deplay = series(handleKits, mainFunctions,  ghPages)
