'use strict';
const fs = require('fs'),
    Readable = require('stream').Readable,
    Writable = require('stream').Writable,
    Transform = require('stream').Transform,
    spawn = require('child_process').spawn,
    chalk = require('chalk'),
    gulp = require('gulp'),
    path = require('path'),
    htmlmin = require('gulp-htmlmin'),
    rename = require('gulp-rename'),
    stylus = require('gulp-stylus'),
    webpack = require('gulp-webpack'),
    base64 = require('gulp-base64'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),

    //默认发布文件夹
    _push = path.join(__dirname, '.deploy_git');

//webpack设置
const webpackConfig = {
    output: {
        filename: 'script.min.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: ['es2015'],
                    plugins: ['transform-runtime']
                }
            }
        ]
    }
};

//缓存类
class Cache extends Writable {
    constructor() {
        super();
        this._cache = [];
    }
    _write(chunk, enc, next) {
        const buf = chunk instanceof Buffer
            ? chunk
            : Buffer.from(chunk, enc);

        this._cache.push(buf);
        next();
    }
    getCache(encoding) {
        encoding = encoding ? encoding : 'utf8';

        const buf = Buffer.concat(this._cache);
        return buf.toString(encoding).trim();
    }
}
//从Buffer创建读取流
class readRam extends Readable {
    constructor(buf) {
        super();
        //保存读取的buffer
        this._cache = buf;
        //读取的起点
        this._index = 0;
        //每次读取60kb
        this._peer = 61440;
    }
    _read() {
        const peer = this._peer,
            index = this._index,
            max = this._cache.length,
            frag = (index <= max)
                ? Buffer.from(this._cache, index, peer)
                : null;

        this._index = index + peer;
        this.push(frag);
    }
}
//文件内容替换
function replace(search, replacement) {
    const ans = Transform({objectMode: true});

    ans._transform = function(buf, enc, next) {
        if (buf.isNull()) {
            return next(null, buf);
        }

        const buffer = buf._contents.toString('utf8')
            .replace(search, replacement);

        buf._contents = Buffer.from(buffer, 'utf8');

        next(null, buf);
    };

    return (ans);
}
//集合数据流
function toVariable(obj) {
    const ans = Writable({objectMode: true});

    ans._write = function(buf, enc, next) {
        const name = buf.relative,
            base = (name === 'index.html')
                ? '/' : '/src/',
            whole = path.join(base, name);

        if (obj[whole]) {
            obj[whole] = Buffer.concat([obj[whole], buf._contents]);
        } else {
            obj[whole] = Buffer.from(buf._contents);
        }

        next();
    };

    return (ans);
}

//特殊字符转义
function escape(html) {
    return html
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
//合并对象
function merge(base, from) {
    for (const i in from) {
        if (from.hasOwnProperty(i)) {
            base[i] = from[i];
        }
    }
}
//内存中间件
function ramMiddleware(files) {
    const url = require('url'),
        etag = require('etag'),
        mime = require('mime-types'),
        parseUrl = require('parseurl'),
        destroy = require('destroy');

    return (req, res, next) => {
        //不允许GET或HEAD以外的方法
        if (req.method !== 'GET' && req.method !== 'HEAD') {
            res.statusCode = 405;
            res.setHeader('Allow', 'GET, HEAD');
            res.setHeader('Content-Length', '0');
            res.end();
            return (false);
        }

        const pathname = parseUrl(req).pathname,
            pathkey = (pathname[pathname.length - 1] === '/')
                ? path.join(pathname, 'index.html')
                : path.normalize(pathname),
            file = files[pathkey],
            resStream = new readRam(file);

        //设置响应的Header
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Cache-Control', 'max-age=0');
        res.setHeader('Last-Modified', (new Date).toUTCString());
        res.setHeader('ETag', etag(file));
        res.setHeader('Content-Type', mime.lookup(pathkey) + ';charset:utf-8');
        res.setHeader('Content-Length', file.length);

        //数据流连接至http响应
        resStream.pipe(res)
            .on('finish', () => destroy(resStream));

        next();
    };
}
//Git子进程
function promiseSpawn(command, args, options) {
    if (!command) { throw new TypeError('command is required!'); }

    if (!options && args && !Array.isArray(args)) {
        options = args;
        args = [];
    }

    args = args || [];
    options = options || {};

    return new Promise((resolve, reject) => {
        const stdoutCache = new Cache(),
            stderrCache = new Cache(),
            task = spawn(command, args, options),
            encoding = options.hasOwnProperty('encoding')
                ? options.encoding
                : 'utf8';

        //流管道连接
        task.stdout.pipe(stdoutCache);
        task.stderr.pipe(stderrCache);

        //子进程结束
        task.on('close', () => {
            console.log(stdoutCache.getCache(encoding));
            resolve();
        });
        //子进程发生错误
        task.on('error', (code) => {
            const e = new Error(stderrCache.getCache(encoding));
            e.code = code;
            return reject(e);
        });
    });
}
//Git操作入口
function git() {
    const opt = { cwd: _push },
        args = [].slice.call(arguments);

    if (args[0] === 'init') {
        //初始化
        //检查文件夹是否存在
        if (!fs.existsSync(_push)) {
            fs.mkdirSync(_push);
        }
        //检查是否初始化git
        if (!fs.existsSync(path.join(_push, '/.git'))) {
            return promiseSpawn('git', ['init'], opt);
        } else {
            return new Promise((n) => n());
        }
    } else {
        //子进程运行git命令
        return (() => promiseSpawn('git', args, opt));
    }
}

gulp.task('build', function() {
    function html(obj) {
        return gulp.src('./index.html')
            .pipe(htmlmin({
                collapseWhitespace: true,
                removeComments: true
            }))
            .pipe(toVariable(obj));
    }
    function image(obj) {
        return gulp.src(['./img/favicons.ico', './img/circuit-grid.svg'])
            .pipe(toVariable(obj));
    }
    function css(obj) {
        return gulp.src('./css/main.styl')
            .pipe(sourcemaps.init())
            .pipe(stylus({compress: true}))
            .pipe(autoprefixer())
            .pipe(base64())
            .pipe(sourcemaps.write())
            .pipe(rename('circuitlab.min.css'))
            .pipe(toVariable(obj));
    }
    function js(obj) {
        return gulp.src('./js/main.js')
            .pipe(sourcemaps.init())
            .pipe(webpack(webpackConfig))
            .pipe(sourcemaps.write())
            .pipe(toVariable(obj));
    }
    function watchFunc(func) {
        return (() => {
            const temp = {};
            new Promise((res) => func(temp).on('finish', res))
                .then(() => merge(source, temp));
        });
    }

    //设置静态服务器，以及初次编译
    const source = {},
        express = require('express'),
        app = express(),
        promises = [html, image, css, js]
            .map((task) => new Promise((res) => task(source).on('finish', res)));

    //服务器挂载文件
    app.use(ramMiddleware(source));

    //初次编译完成后，建立虚拟网站，端口5000
    Promise.all(promises)
        .then(() => app.listen(5000, () => {
            console.log(chalk.green('\nINFO:') + ' 虚拟网站已建立于 http://localhost:5000/');
            console.log(chalk.green('INFO:') + ' CTRL + C 退出当前状态');
            console.log(chalk.green('INFO:') + ' 本程序不支持热替换！');
        }));

    gulp.watch('./index.html', watchFunc(html));
    gulp.watch('./css/*.styl', watchFunc(css));
    gulp.watch('./js/*.js', watchFunc(js));
});
gulp.task('push', function() {
    function html(res) {
        gulp.src('./index.html')
            .pipe(htmlmin({
                collapseWhitespace: true,
                removeComments: true
            }))
            .pipe(gulp.dest(_push))
            .on('finish', res);
    }
    function image(res) {
        gulp.src(['./img/favicons.ico', './img/circuit-grid.svg'])
            .pipe(gulp.dest(path.join(_push, 'src')))
            .on('finish', res);
    }
    function css(res) {
        gulp.src('./css/main.styl')
            .pipe(stylus({compress: true}))
            .pipe(autoprefixer())
            .pipe(base64())
            .pipe(rename('circuitlab.min.css'))
            .pipe(gulp.dest(path.join(_push, 'src')))
            .on('finish', res);
    }
    function js(res) {
        const temp = path.join(__dirname, 'js', 'main2.js'),
            reg1 = /^((?:[^\n]?)+?import[^\n]+?\.\/test[^\n]+?)$/mg,
            reg2 = /^([^\n]+?mapTest[^\n]+?$)/mg;

        gulp.src('./js/main.js')
            .pipe(replace(reg1, '//$1'))
            .pipe(rename('main2.js'))
            .pipe(gulp.dest('./js/'))
            .pipe(webpack(webpackConfig))
            .pipe(replace(reg2, '//$1'))
            .pipe(uglify())
            .pipe(gulp.dest(path.join(_push, 'src')))
            .on('finish', () => { fs.unlinkSync(temp); res(); });
    }

    const url = 'https://github.com/xiaoboost/circuitlab.git',
        branch = 'gh-pages',
        promises = [html, image, css, js].map((n) => new Promise(n));

    Promise.all(promises)
        .then(git('init'))
        .then(git('add', '-A'))
        .then(git('commit', '-m', 'update'))
        .then(git('push', '-u', url, 'master:' + branch, '--force'))
        .then(() => console.log(chalk.green('\nINFO:') + ' 文件上传完毕'))
        .catch((err) => console.log(chalk.red('\nERROR:') + ' 发生错误，意外中止\n' + err));
});
