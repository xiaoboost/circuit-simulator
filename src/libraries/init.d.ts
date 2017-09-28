
declare interface ObjectConstructor {
    /**
     * 输入对象是否含有可枚举元素
     * 
     * @param {object} from 
     * @returns {boolean} 
     * @memberof ObjectConstructor
     */
    isEmpty(from: object): boolean,
    clone(from: object): object,
    hideAll(from: any): void,
    freezeAll(from: any): void,
    sealAll(from: any): void,
};

declare interface Object {
    /**
     * 当前对象实例与输入元素是否相等
     * 
     * @param {*} obj 
     * @returns {boolean} 
     * @memberof Object
     */
    isEqual(obj: any): boolean,

}

// Object类原型方法扩展
Object.assign(Object.prototype, {
    // 对象是否相等
    isEqual(obj) {
        const thisKeys = Object.keys(this),
            fromKeys = Object.keys(obj);

        if (!thisKeys.isEqual(fromKeys)) {
            return (false);
        }

        return thisKeys.every(
            (key) =>
                (this[key] instanceof Object)
                    ? this[key].isEqual(obj[key])
                    : this[key] === obj[key]
        );
    },
    map(fn) {
        return Object
            .keys(this)
            .reduce((obj, key) =>
                ((obj[key] = fn(this[key])), obj), {});
    },
});

// Array类静态方法扩展
Object.assign(Array, {
    // 数组深复制
    clone: (from) => from.map((n) => clone(n)),
});
// Array类原型方法扩展
Object.assign(Array.prototype, {
    // 数组是否相等
    isEqual(arr) {
        if (!arr) {
            return (false);
        }
        if (this.length !== arr.length) {
            return (false);
        }

        return this.every(
            (item, i) =>
                (item instanceof Object)
                    ? item.isEqual(arr[i])
                    : item === arr[i]
        );
    },
    // 取出下标为index的元素
    get(index) {
        const sub = (index >= 0)
            ? index
            : this.length + index;

        return (sub >= 0 && sub < this.length)
            ? this[sub]
            : false;
    },
    // 删除回调返回第一个 true 的元素
    delete(fn) {
        if (!(fn instanceof Function)) {
            fn = (item) => item === fn;
        }
        const index = this.findIndex(fn);
        if (index !== -1) {
            this.splice(index, 1);
            return (true);
        } else {
            return (false);
        }
    },
    // 用于 vue 数组的元素赋值
    $set(i, item) {
        if (this[i] !== item) {
            this.splice(i, 1, item);
        }
    },
});

// Number类原型方法扩展
Object.assign(Number.prototype, {
    /**
     * 按照有效数字位数进行四舍五入
     * @param {Number} [bits=6]
     * @returns {Number}
     */
    toRound(bits = 6) {
        const origin = this.valueOf();
        if (Number.isNaN(origin)) { return (false); }

        const number = Math.abs(origin),
            toInt = Math.floor(Math.log10(number)) - bits + 1,
            transform = 10 ** toInt,
            // round 一定是整数
            round = String(Math.round(number / transform)),
            // 原始数据符号
            sign = origin < 0 ? '-' : '';

        // 插入小数点
        let str = '';
        if (toInt > 0) {
            str = round + '0'.repeat(toInt);
        } else if (-toInt >= bits) {
            str = '0.' + '0'.repeat(-toInt - bits) + round;
        } else {
            str = round.slice(0, toInt) + '.' + round.slice(toInt);
        }

        return Number.parseFloat(sign + str);
    },
    // 数量级
    rank() {
        const number = Math.abs(this.valueOf());
        if (Number.isNaN(number)) { return (false); }

        return Math.floor(Math.log10(number));
    },
});
