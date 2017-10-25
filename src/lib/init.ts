import assert from './assertion';

Object.assign(Object, {
    /**
     * 输入对象是否含有可枚举元素
     *
     * @param {object} from
     * @returns {boolean}
     */
    isEmpty: (from: {}) => Object.keys(from).length === 0,
    /**
     * 将输入对象的所有可枚举属性全部隐藏
     *
     * @param {object} from
     * @returns {boolean}
     */
    hideAll: (obj: {}): void => Object.keys(obj).forEach((key) => {
        Object.defineProperty(obj, key, {
            configurable: false,
            enumerable: false,
        });
    }),
    /**
     * 将输入对象以及下属所有对象全部冻结
     *
     * @param {*} from
     * @returns {boolean}
     */
    freezeAll(obj: any): boolean {
        if (!assert.isObject(obj)) {
            return (false);
        }

        Object.keys(obj).forEach((key) => Object.freezeAll(obj[key]));
        Object.freeze(obj);
        return (true);
    },
    /**
     * 将输入对象以及下属所有对象全部封闭
     *
     * @param {*} from
     * @returns {boolean}
     */
    sealAll(obj: any): boolean {
        if (!assert.isObject(obj)) {
            return (false);
        }

        Object.keys(obj).forEach((key) => Object.sealAll(obj[key]));
        Object.seal(obj);
        return (true);
    },
});

Object.assign(Object.prototype, {
    /**
     * 当前对象实例与输入对象是否相等
     *
     * @param {*} obj
     * @returns {boolean}
     */
    isEqual(this: {}, obj: {}) {
        if (!assert.isObject(obj)) {
            return (false);
        }
        if (!Object.keys(this).isEqual(Object.keys(obj))) {
            return (false);
        }

        return Object.entries(this).every(
            ([key, value]) =>
                (assert.isObject(value) && assert.isFuncton(value.isEqual))
                    ? value.isEqual(obj[key])
                    : value === obj[key],
        );
    },
    // map<T, U, K extends keyof T>(this: T, callback: (value: T[K], key: string) => U): { K: U } {
    //     const ans = Object.assign({}, this) as T;

    //     Object.entries(this).forEach(([key, value]) => {
    //         ans[key] = callback(value, key);
    //     });

    //     return (ans);
    // },
});

Object.assign(Array.prototype, {
    /**
     * 当前数组与输入是否相等
     *
     * @param {any} to
     * @returns {boolean}
     */
    isEqual(this: any[], to: any): boolean {
        if (!assert.isArray(to)) {
            return (false);
        }
        if (this.length !== to.length) {
            return (false);
        }

        return this.every(
            (item, i) =>
                (assert.isObject(item) && assert.isFuncton(item.isEqual))
                    ? item.isEqual(to[i])
                    : item === to[i],
        );
    },
    /**
     * 根据下标取出当前数组元素
     *
     * @template T
     * @param {T[]} this
     * @param {number} index
     * @returns {T}
     */
    get<T>(this: T[], index: number): T {
        const sub = (index >= 0) ? index : this.length + index;

        if (sub < 0 || sub >= this.length) {
            throw new Error('(array) index out of bounds.');
        }

        return this[sub];
    },
    /**
     * 从下标 0 开始，删除 predicate 第一个返回 true 的元素
     *
     * @template T
     * @param {T[]} this
     * @param {(value: T, index: number) => boolean} predicate
     * @returns {boolean}
     */
    delete<T>(this: T[], predicate: (value: T, index: number) => boolean): boolean {
        const index = this.findIndex(predicate);

        if (index !== -1) {
            this.splice(index, 1);
            return (true);
        } else {
            return (false);
        }
    },
    /**
     * 数组去重
     *  - 如果没有输入 label 函数，则对数组元素直接去重
     *  - 如果输入了 label 函数，将会使用该函数对数组元素做一次转换，对转换之后的值进行去重，最后再映射回原数组
     *
     * @template T
     * @param {T[]} this
     * @param {((value: T, index: number) => number | string)} [label]
     * @returns {T[]}
     */
    unique<T>(this: T[], label?: (value: T, index: number) => number | string): T[] {
        if (assert.isNull(label)) {
            return [...new Set(this)];
        }

        const labelMap: { [key: string]: boolean } = {};
        return this
            .map((value, index) => ({ value, key: label(value, index) }))
            .filter(({ key }) => (labelMap[key] ? false : (labelMap[key] = true)))
            .map(({ value }) => value);

    },
    // 用于 vue 数组的元素赋值
    $set(this: any[], i: number, item: any): void {
        if (this[i] !== item) {
            this.splice(i, 1, item);
        }
    },
});

Object.assign(Number, {
    /**
     * 用于匹配科学记数法表示的字符串
     */
    SCIMatch: /^\d+(?:\.\d+)?$|^\d+?(?:\.\d+)?[eE]-?\d+$|^\d+(?:\.\d+)?[puμnmkMG]$/,
    /**
     * 将用科学记数法的字符串转换为对应的数字
     *
     * @param {string} notation
     * @returns {number}
     */
    SCIParser(notation: string): number {
        if (Number.SCIMatch.test(notation)) {
            return NaN;
        }
        else if (/[eE]/.test(notation)) {
            const [base, power] = notation.split(/[eE]/);
            return Number(base) * Math.pow(10, Number(power));
        }
        else if (/[puμnmkMG]$/.test(notation)) {
            const exp = { p: -12, u: -9, μ: -9, n: -6, m: -3, k: 3, M: 6, G: 9 },
                power = exp[notation[notation.length - 1]] as number,
                base = notation.substring(0, notation.length - 1);

            return Number(base) * Math.pow(10, power);
        }
        else {
            return Number(notation);
        }
    },
});

Object.assign(Number.prototype, {
    /**
     * 按照有效数字的位数进行四舍五入。
     *  - 默认 6 位有效数字 [bits=6]
     *
     * @param {number} [bits=6]
     * @returns {number}
     */
    toRound(this: number, bits: number = 6): number {
        const origin = this.valueOf();

        if (Number.isNaN(origin)) {
            throw new Error('Illegal Number');
        }

        const value = Math.abs(origin),
            toInt = Math.floor(Math.log10(value)) - bits + 1,
            transform = 10 ** toInt,
            // round 一定是整数
            round = String(Math.round(value / transform)),
            // 原始数据符号
            sign = origin < 0 ? '-' : '';

        // 插入小数点
        let str = '';
        if (toInt > 0) {
            str = round + '0'.repeat(toInt);
        } else if (-toInt >= bits) {
            str = `0.${'0'.repeat(-toInt - bits)}${round}`;
        } else {
            str = `${round.slice(0, toInt)}.${round.slice(toInt)}`;
        }

        return Number.parseFloat(sign + str);
    },
    /**
     * 求数字的数量级
     *
     * @returns {number}
     */
    rank(this: number): number {
        const value = Math.abs(this.valueOf());

        if (Number.isNaN(value)) {
            throw new Error('Illegal Number');
        }

        return Math.floor(Math.log10(value));
    },
});

// 隐藏所有扩展的原生属性
Object.hideAll(Array);
Object.hideAll(Object);
Object.hideAll(Object.prototype);
Object.hideAll(Array.prototype);
Object.hideAll(Number.prototype);
Object.hideAll(String.prototype);

// 网页禁止右键
window.document.oncontextmenu = () => false;
