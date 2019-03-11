import { getType } from 'mime';
import { Context } from 'koa';
import { spawn } from 'child_process';
import { join } from 'path';

/**
 * Generate tag of build
 * @returns {string}
 */
export function buildTag() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const time = now.toTimeString().slice(0, 8);

    return `${year}.${month}.${date} - ${time}`;
}

/**
 * 定位到项目根目录
 * @param {string} dir 路径
 */
export const resolve = (...dir: string[]) => join(__dirname, '..', ...dir);

/**
 * 内存中间件
 * @param {object} fileSystem 文件系统
 * @param {string} 文件根目录
 */
export function ramMiddleware(fileSystem: any, root: string) {
    return function middleware(ctx: Context, next: Function) {
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

        if (!fileSystem.existsSync(filePath)) {
            ctx.status = 404;
            ctx.length = 0;
            next();
            return (false);
        }

        const fileStat = fileSystem.statSync(filePath);

        ctx.type = getType(filePath)!;
        ctx.lastModified = new Date();

        ctx.set('Accept-Ranges', 'bytes');
        ctx.set('Cache-Control', 'max-age=0');

        // node-fs
        if (fileStat.size) {
            ctx.length = fileStat.size;
        }
        // memory-fs
        else {
            ctx.length = Buffer.from(fileSystem.readFileSync(filePath)).length;
        }

        ctx.body = fileSystem.createReadStream(filePath);
        next();
    };
}

/** 子进程 promise 封装 */
export function promiseSpawn(command: string, ...args: string[]) {
    return new Promise<void>((res, rej) => {
        const task = spawn(command, args);
        task.on('close', res);
        task.on('error', rej);
    });
}
