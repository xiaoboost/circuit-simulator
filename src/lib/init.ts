import assert from './assertion';

Object.assign(Object, {
    isEmpty: (from: {}) => Object.keys(from).length === 0,
    hideAll: (obj: {}): void => Object.keys(obj).forEach((key) => {
        Object.defineProperty(obj, key, {
            configurable: false,
            enumerable: false,
        });
    }),
    freezeAll(obj: any): boolean {
        if (!assert.isObject(obj)) {
            return (false);
        }

        Object.keys(obj).forEach((key) => Object.freezeAll(obj[key]));
        Object.freeze(obj);
        return (true);
    },
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
    // 对象是否相等
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
    // 取出下标为 index 的元素
    get(this: any[], index: number): any {
        const sub = (index >= 0) ? index : this.length + index;

        if (sub < 0 || sub >= this.length) {
            throw new Error('(array) index out of bounds.');
        }

        return this[sub];
    },
    // 删除回调返回第一个 true 的元素
    delete(this: any[], predicate: (value: any, index: number) => boolean): boolean {
        const index = this.findIndex(predicate);

        if (index !== -1) {
            this.splice(index, 1);
            return (true);
        } else {
            return (false);
        }
    },
    // 用于 vue 数组的元素赋值
    $set(this: any[], i: number, item: any): void {
        if (this[i] !== item) {
            this.splice(i, 1, item);
        }
    },
});

Object.assign(Number.prototype, {
    // 按照有效数字位数进行四舍五入
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
    // 数量级
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
