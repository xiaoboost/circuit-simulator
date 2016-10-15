"use strict";
const gulp = require("gulp"),
    htmlmin = require("gulp-htmlmin"),
    concat = require("gulp-concat"),
    rename = require("gulp-rename"),
    stylus = require("gulp-stylus"),
    webpack = require("gulp-webpack"),
    base64 = require("gulp-base64"),
    sourcemaps = require("gulp-sourcemaps");

//图标和网格复制
gulp.task("image", function () {
    return gulp.src(["./img/favicons.ico", "./img/circuit-grid.svg"])
        .pipe(gulp.dest("./_develop/src/"));
});

//开发版本任务
gulp.task("develop-html", function() {
    return gulp.src("./index.html")
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest("./_develop/"));
});
gulp.task("develop-stylus", function () {
    return gulp.src("./css/main.styl")
        .pipe(sourcemaps.init())
        .pipe(stylus({
            compress: true
        }))
        .pipe(base64())
        .pipe(sourcemaps.write())
        .pipe(rename({
            basename: "circuitlab",
            suffix: ".min"
        }))
        .pipe(gulp.dest("./_develop/src/"));
});
gulp.task("develop-js", function () {
    return gulp.src("./js/main.js")
        .pipe(webpack({
            devtool: "source-map",
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
        .pipe(gulp.dest("./_develop/src/"));
});
gulp.task("build", function () {
    //设置静态服务器
    const express = require("express"),
        app = express();

    //允许网页访问theme文件夹
    app.use(express.static("./_develop/"));
    //建立虚拟网站，端口5000
    app.listen(5000, function () {
        console.info("INFO : 虚拟网站已建立于 http://localhost:5000/");
        console.info("INFO : CTRL + C 退出当前状态");
    });

    // 首次运行task
    gulp.run("develop-html", "develop-stylus", "develop-js", "image");
    // 监听html文件变化
    gulp.watch("./index.html", ["develop-html"]);
    // 监听stylus文件变化
    gulp.watch("./css/*.styl", ["develop-stylus"]);
    // 监听js文件
    gulp.watch("./js/*.js", ["develop-js"]);
});