"use strict";
const gulp = require("gulp"),
    htmlmin = require("gulp-htmlmin"),
    concat = require("gulp-concat"),
    rename = require("gulp-rename"),
    stylus = require("gulp-stylus"),
    webpack = require("gulp-webpack"),
    base64 = require("gulp-base64"),
    uglify = require("gulp-uglifyjs"),
    sourcemaps = require("gulp-sourcemaps"),
    autoprefixer = require("gulp-autoprefixer"),

    _develop = "Z:/在线仿真网站/",
    _push = "./.deploy_git/";

//开发版本任务
gulp.task("develop-html", function() {
    return gulp.src("./index.html")
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest(_develop));
});
gulp.task("develop-stylus", function () {
    return gulp.src("./css/main.styl")
        .pipe(sourcemaps.init())
        .pipe(stylus({
            compress: true
        }))
        .pipe(autoprefixer())
        .pipe(base64())
        .pipe(sourcemaps.write())
        .pipe(rename({
            basename: "circuitlab",
            suffix: ".min"
        }))
        .pipe(gulp.dest(_develop + "src/"));
});
gulp.task("develop-js", function () {
    return gulp.src("./js/main.js")
        .pipe(webpack({
            //devtool: "source-map",
            output: {
                filename: "script.min.js"
            },
            module: {
                loaders: [
                    {
                        test: /\.js$/,
                        exclude: /(node_modules|bower_components)/,
                        loader: "babel",
                        query: {
                            presets: ["es2015"],
                            plugins: ["transform-runtime"]
                        }
                    }
                ]
            }
        }))
        .pipe(gulp.dest(_develop + "src/"));
});
gulp.task("develop-image", function () {
    return gulp.src(["./img/favicons.ico", "./img/circuit-grid.svg"])
        .pipe(gulp.dest(_develop + "src/"));
});
gulp.task("build", function () {
    //设置静态服务器
    const express = require("express"),
        app = express();

    //允许网页访问theme文件夹
    app.use(express.static(_develop));
    //建立虚拟网站，端口5000
    app.listen(5000, function () {
        console.info(" INFO : 虚拟网站已建立于 http://localhost:5000/");
        console.info(" INFO : CTRL + C 退出当前状态");
    });

    // 首次运行task
    gulp.run("develop-html", "develop-stylus", "develop-js", "develop-image");
    // 监听html文件变化
    gulp.watch("./index.html", ["develop-html"]);
    // 监听stylus文件变化
    gulp.watch("./css/*.styl", ["develop-stylus"]);
    // 监听js文件
    gulp.watch("./js/*.js", ["develop-js"]);
});

//发布版本任务
gulp.task("push-html", function() {
    return gulp.src("./index.html")
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest(_push));
});
gulp.task("push-image", function () {
    return gulp.src(["./img/favicons.ico", "./img/circuit-grid.svg"])
        .pipe(gulp.dest(_push + "src/"));
});
gulp.task("push-stylus", function () {
    return gulp.src("./css/main.styl")
        .pipe(stylus({
            compress: true
        }))
        .pipe(autoprefixer())
        .pipe(base64())
        .pipe(rename({
            basename: "circuitlab",
            suffix: ".min"
        }))
        .pipe(gulp.dest(_push + "src/"));
});
gulp.task("push-js", function () {
    return gulp.src("./js/main.js")
        .pipe(webpack({
            output: {
                filename: "script.min.js"
            },
            module: {
                loaders: [
                    {
                        test: /\.js$/,
                        exclude: /(node_modules|bower_components)/,
                        loader: "babel",
                        query: {
                            presets: ["es2015"],
                            plugins: ["transform-runtime"]
                        }
                    }
                ]
            }
        }))
        .pipe(uglify())
        .pipe(gulp.dest(_push + "src/"));
});
gulp.task("push", function () {
    gulp.run("push-html", "push-stylus", "push-js", "push-image");
});