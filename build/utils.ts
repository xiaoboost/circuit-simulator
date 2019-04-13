import { spawn } from 'child_process';
import { join } from 'path';

/**
 * Generate tag of build
 * @returns {string}
 */
function buildTag() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const time = now.toTimeString().slice(0, 8);

    return `${year}.${month}.${date} - ${time}`;
}

/** 当前版本号 */
export const version = buildTag();

/**
 * 定位到项目根目录
 * @param {string} dir 路径
 */
export const resolve = (...dir: string[]) => join(__dirname, '..', ...dir);

/** 子进程 promise 封装 */
export function promiseSpawn(command: string, ...args: string[]) {
    return new Promise<void>((res, rej) => {
        const task = spawn(command, args);
        task.on('close', res);
        task.on('error', rej);
    });
}
