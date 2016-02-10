"use strict";
var path = require("path"),
    fs = require("fs"),
    args = require('yargs').argv;

var gulp = require("gulp"),
    debug = require("gulp-debug"),
    plugins = require("gulp-load-plugins")();
    
var browserSync = require('browser-sync'),
    livereload = browserSync.reload;

var json = JSON.parse(fs.readFileSync("./package.json"));
var config = (function () {
    var appName = json.name;

    var path = {
        bower: "./bower_components/",
        assets: "./assets",
        static: "./static"
    };

    return {
        path: path,
        scss: {
            input: path.assets + "/scss/main.scss",
            include: [
                path.bower + "/bootstrap-sass/assets/stylesheets",
                path.assets + "/scss/"
            ],
            output: path.static + "/css",
            watch: [path.assets + "/scss/**.scss"]
        },
        script: {
            input: [
                path.assets + "/js/*.js"
            ],
            output: path.static + "/js/script.js", 
            watch: [path.assets + "/js/*.js"]
        },
        images: {
            input: path.assets + '/images/**',
            output: path.static + '/images/',
            watch: [path.assets + '/images/**']
        }
    };
}());

gulp.task("bower", function () {
    return plugins.bower(config.path.bower);
});

gulp.task('serve', function (){
    browserSync({
        proxy: args.host || 'localhost:8000'
    });
});

gulp.task("js", function () {
    var filename = path.basename(config.script.output);
    var directory = path.dirname(config.script.output);

    return gulp.src(config.script.input)
        .pipe(plugins.plumber());
        .pipe(plugins.concat(filename, {newLine: ';'}))
        .pipe(gulp.dest(directory))
        .pipe(livereload({ stream:true }))
        .pipe(plugins.uglify())
        .pipe(plugins.rename({extname: ".min.js"}))
        .pipe(gulp.dest(directory))
        .pipe(livereload({ stream:true }));
});

gulp.task("scss", function () {
    return gulp.src(config.scss.input)
        .pipe(plugins.plumber())
        .pipe(plugins.sourcemaps.init({ debug: true }))
        .pipe(plugins.sass({
            style: "expanded",
            includePaths: config.scss.include
        }))
        .pipe(plugins.autoprefixer())
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest(config.scss.output))
        .pipe(livereload({ stream:true }))
        .pipe(plugins.rename({extname: ".min.css"}))
        .pipe(plugins.uglifycss())
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest(config.scss.output))
        .pipe(livereload({ stream:true }));
});

gulp.task("images", function () {
    return gulp.src(config.images.input)
            .pipe(plugins.imagemin())
            .pipe(gulp.dest(config.images.output))
            .pipe(livereload({ stream:true }));
});

// Rerun the task when a file changes
gulp.task("watch", ["serve"], function () {
    config.scss.watch.forEach(function (path) {
        gulp.watch(path, ["scss"]);
    });

    config.script.watch.forEach(function (path) {
        gulp.watch(path, ["js"]);
    });

    config.images.watch.forEach(function (path) {
        gulp.watch(path, ["images"]);
    });


});

gulp.task("build", 
    [
        "bower", 
        "images", 
        "js", 
        "scss", 
    ]);

gulp.task("default", 
    [
        "js", 
        "scss", 
        "images", 
        "watch"
    ]);
