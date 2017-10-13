// tslint:disable-next-line
/// <reference path="./init.d.ts" />

// 深复制
// TODO: 还需要考虑循环引用的情况，此时应当直接抛出错误
function clone(from: any): any {
    if (from instanceof Array) {
        return Array.clone(from);
    } else if (from instanceof Object) {
        return Object.clone(from);
    } else {
        return from;
    }
}

Object.assign(Object, {
    isEmpty: (from: {}) => Object.keys(from).length === 0,

    clone(from: {}): {} {
        return Object
            .keys(from)
            .reduce((obj, key) => ((obj[key] = clone(from[key])), obj), {});
    },

    hideAll: (obj: {}): void => Object.keys(obj).forEach((key) => {
        Object.defineProperty(obj, key, {
            configurable: false,
            enumerable: false,
        });
    }),
    freezeAll(obj: {}): boolean {
        if (!(obj instanceof Object)) {
            return (false);
        }

        Object.keys(obj).forEach((key) => Object.freezeAll(obj[key]));
        Object.freeze(obj);
        return (true);
    },
    sealAll(obj: {}): boolean {
        if (!(obj instanceof Object)) {
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
        const thisKeys = Object.keys(this),
            fromKeys = Object.keys(obj);

        if (!thisKeys.isEqual(fromKeys)) {
            return (false);
        }

        return thisKeys.every(
            (key) => {
                const value = this[key] as {};
                return (Boolean(value) && Boolean(value.isEqual))
                    ? value.isEqual(obj[key])
                    : value === obj[key];
            },
        );
    },
    map(this: {}, fn: (value: any, key: string) => any) {
        return Object
            .keys(this)
            .reduce((obj, key) => ((obj[key] = fn(this[key], key)), obj), {});
    },
});

Object.assign(Array, {
    clone: (from: any[]) => from.map(clone),
});

Object.assign(Array.prototype, {
    isEqual(this: any[], arr: any): boolean {
        if (Boolean(arr)) {
            return (false);
        }
        if (this.length !== arr.length) {
            return (false);
        }

        return this.every(
            (item, i) =>
                (Boolean(item) && Boolean((item as any[]).isEqual))
                    ? (item as  any[]).isEqual(arr[i])
                    : item === arr[i],
        );
    },
    // 取出下标为 index 的元素
    get(this: any[], index: number): any {
        const sub = (index >= 0)
            ? index
            : this.length + index;

        return (sub >= 0 && sub < this.length)
            ? this[sub]
            : false;
    },
    // 删除回调返回第一个 true 的元素
    delete(this: any[], predicate: (value: any, index: number) => boolean): boolean {
        const fn = (predicate instanceof Function)
            ? predicate
            : (item) => item === predicate;
        const index = this.findIndex(fn);

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

        const value = Math.abs(this.valueOf()),
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
