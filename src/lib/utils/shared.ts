/**
 * 生成异步延迟函数
 * @param {number} [time=0]
 * @returns {Promise<void>}
 */
export function delay(time = 0) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * 生成一个一次性的事件
 * @param {Element} el
 * @param {string} type
 * @returns {Promise<Event>}
 */
export function onceEvent(el: Element, type: string) {
    let option: boolean | {
        passive?: boolean;
        once?: boolean;
    };

    if (!supportsPassive && !supportsOnce) {
        option = false;
    }
    else {
        option = {};

        if (supportsPassive) {
            option.passive = true;
        }
        if (supportsOnce) {
            option.once = true;
        }
    }

    return new Promise((resolve) => {
        el.addEventListener(
            type,
            function once(event: Event) {
                resolve(event);
                if (!supportsOnce) {
                    el.removeEventListener(type, once);
                }
            },
            option,
        );
    });
}

/**
 * 生成随机字符串
 * @param {number} [len=16] 字符串长度
 * @returns {string}
 */
export function randomString(len = 16) {
    const start = 48, end = 126;
    const exclude = '\\/[]?{};,<>:|`';

    let codes = '';
    while (codes.length < len) {
        const code = String.fromCharCode(Math.random() * (end - start) + start);

        if (!exclude.includes(code)) {
            codes += code;
        }
    }

    return codes;
}

/**
 * 返回一个判断 key 是否存在其中的函数
 * @param {string} map 数据聚合
 * @param {boolean} [expectsLowerCase=false] 判断时是否变为小写
 */
export function makeMap(map: string, expectsLowerCase = false) {
    const inside = {};

    map.split(',').forEach((key) => (inside[key] = true));

    return expectsLowerCase
        ? (key: string) => Boolean(inside[key.toLowerCase()])
        : (key: string) => Boolean(inside[key]);
}
