/**
 * 生成异步延迟函数
 * @param {number} [time=0]
 * @returns {Promise<void>}
 */
export function delay(time = 0) {
    return new Promise<void>((resolve) => setTimeout(resolve, time));
}
