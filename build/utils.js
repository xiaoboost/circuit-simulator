const { join } = require('path');
const { getType } = require('mime');
const { spawn } = require('child_process');

/**
 * Generate tag of build
 * @returns {string}
 */
exports.buildTag = function() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const time = now.toTimeString().slice(0, 8);

    return `${year}.${month}.${date} - ${time}`;
};

/**
 * 定位到项目根目录
 * @param {string} dir 路径
 */
exports.resolve = (...dir) => join(__dirname, '..', ...dir);

/**
 * 内存中间件
 * @param {object} fs 文件系统
 * @param {string} 文件根目录
 */
exports.ramMiddleware = function(fs, root) {
    return function middleware(ctx, next) {
        if (ctx.method !== 'GET' && ctx.method !== 'HEAD') {
            ctx.status = 405;
            ctx.length = 0;
            ctx.set('Allow', 'GET, HEAD');
            next();
            return (false);
        }

        const filePath = ctx.path[ctx.path.length - 1] === '/'
            ? join(root, ctx.path, 'index.html')
            : join(root, ctx.path);

        if (!fs.existsSync(filePath)) {
            ctx.status = 404;
            ctx.length = 0;
            next();
            return (false);
        }

        const fileStat = fs.statSync(filePath);

        ctx.type = getType(filePath);
        ctx.lastModified = new Date();

        ctx.set('Accept-Ranges', 'bytes');
        ctx.set('Cache-Control', 'max-age=0');

        // node-fs
        if (fileStat.size) {
            ctx.length = fileStat.size;
        }
        // memory-fs
        else {
            ctx.length = Buffer.from(fs.readFileSync(filePath)).length;
        }

        ctx.body = fs.createReadStream(filePath);
        next();
    };
};

/** 子进程 promise 封装 */
exports.promiseSpawn = function(command, ...args) {
    return new Promise((resolve) => {
        const task = spawn(command, args);
        task.on('close', resolve);
        // task.on('error', reject);
    });
};
