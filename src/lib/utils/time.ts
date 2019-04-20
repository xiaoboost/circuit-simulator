/**
 * 生成异步延迟函数
 * @param {number} [time=0]
 * @returns {Promise<void>}
 */
export function delay(time = 0) {
    return new Promise<void>((resolve) => setTimeout(resolve, time));
}

/**
 * 轮询等待输入函数返回`true`
 * @param {() => boolean} fn
 * @param {number} [interval=200]
 * @param {number} [stopTimeout=60000]
 * @returns {Promise<void>}
 */
export function wait(fn: () => boolean, interval = 200, stopTimeout = 60000) {
    let timeout = false;

    const timer = setTimeout(() => timeout = true, stopTimeout);

    return (function check(): Promise<void> {
        if (fn()) {
            clearTimeout(timer);
            return Promise.resolve();
        }
        else if (!timeout) {
            return delay(interval).then(check);
        }
        else {
            return Promise.resolve();
        }
    })();
}
