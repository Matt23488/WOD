var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var watchify = require("watchify");
var tsify = require("tsify");
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
var buffer = require("vinyl-buffer");
var fancy_log = require("fancy-log");
var browserSync = require("browser-sync").create();
var sass = require("gulp-sass");

var watchedBrowserify = watchify(browserify({
    basedir: ".",
    debug: true,
    entries: ["src/client/main.ts"],
    cache: {},
    packageCache: {}
})).plugin(tsify);

function bundle() {
    return watchedBrowserify
        .bundle()
        .pipe(source("app.bundle.js"))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("docs"));
}

gulp.task("typescript", bundle);
watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", fancy_log);

gulp.task("serve", function () {
    // browserSync.init({
    //     server: "./docs",
    //     port: 8080
    // });

    gulp.watch("src/scss/**/*.scss", gulp.parallel(["sass"]));
    // gulp.watch("docs/*.html").on("change", browserSync.reload);
});

gulp.task("sass", function () {
    return gulp.src("src/scss/site.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest("docs"))
        .pipe(browserSync.stream());
});

gulp.task("default", gulp.parallel(["sass", "serve", "typescript"]));