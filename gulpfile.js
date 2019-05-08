var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var watchify = require("watchify");
var tsify = require("tsify");
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
var buffer = require("vinyl-buffer");
var fancy_log = require("fancy-log");
var paths = {
    pages: ["src/*.html"],
    css: ["src/css/*.css"],
    favicons: [
        "src/*.png",
        "src/browserconfig.xml",
        "src/favicon.ico",
        "src/site.webmanifest"
    ],
    images: ["src/images/*.png"],
    swal: ["node_modules/sweetalert/dist/sweetalert.min.js"]
};

var watchedBrowserify = watchify(browserify({
    basedir: ".",
    debug: true,
    entries: ["src/ts/main.ts"],
    cache: {},
    packageCache: {}
})).plugin(tsify);

gulp.task("copy-html", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest("docs"));
});
gulp.task("copy-css", function () {
    return gulp.src(paths.css)
        .pipe(gulp.dest("docs/css"));
});
gulp.task("copy-favicons", function () {
    return gulp.src(paths.favicons)
        .pipe(gulp.dest("docs"));
});
gulp.task("copy-images", function () {
    return gulp.src(paths.images)
        .pipe(gulp.dest("docs/images"));
});
gulp.task("copy-swal", function () {
    return gulp.src(paths.swal)
        .pipe(gulp.dest("docs/lib"));
});

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

gulp.task("default", gulp.series(gulp.parallel("copy-html", "copy-css", "copy-favicons", "copy-images", "copy-swal"), bundle));
watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", fancy_log);