// 深复制
// TODO: 还需要考虑循环引用的情况，此时应当直接抛出错误
function clone(from) {
    if (from instanceof Array) {
        return Array.clone(from);
    } else if (from instanceof Object) {
        return Object.clone(from);
    } else {
        return from;
    }
}

// Object类静态方法扩展
Object.assign(Object, {
    // 是否含有可枚举属性
    isEmpty: (from) => !Object.keys(from).length,
    // 深复制对象
    clone: (from) => Object.keys(from)
        .reduce((obj, key) =>
            (obj[key] = clone(from[key]), obj), {}),
    // 隐藏所有可枚举的属性
    hideAll: (obj) => Object.keys(obj).forEach((key) => Object.defineProperty(obj, key, {
        configurable: false,
        enumerable: false
    })),
    // 深度冻结当前对象
    freezeAll(obj) {
        if (!(obj instanceof Object)) { return (false); }
        Object.keys(obj).forEach((key) => Object.freezeAll(obj[key]));
        Object.freeze(obj);
    },
    // 深封闭对象
    sealAll(obj) {
        if (!(obj instanceof Object)) { return (false); }
        Object.keys(obj).forEach((key) => Object.sealAll(obj[key]));
        Object.seal(obj);
    }
});
// Object类原型方法扩展
Object.assign(Object.prototype, {
    // 对象是否相等
    isEqual(obj) {
        const thisKeys = Object.keys(this),
            fromKeys = Object.keys(obj);

        if (!thisKeys.isEqual(fromKeys)) {
            return (false);
        }

        return thisKeys.every((key) => (this[key] instanceof Object)
            ? this[key].isEqual(obj[key])
            : this[key] === obj[key]
        );
    },
    map(fn) {
        return Object.keys(this)
            .reduce((obj, key) =>
                (obj[key] = fn(this[key], key), obj), {});
    }
});

// Array类静态方法扩展
Object.assign(Array, {
    // 数组深复制
    clone: (from) => from.map((n) => clone(n))
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

        return this.every((item, i) => (item instanceof Object)
            ? item.isEqual(arr[i])
            : item === arr[i]
        );
    },
    //取出下标为index的元素
    get(index) {
        const sub = (index >= 0)
            ? index
            : this.length + index;

        return (sub >= 0 && sub < this.length)
            ? this[sub]
            : false;
    }
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
    // 单位化
    toUnit() {
        const number = this.valueOf();
        if (number > 0) {
            return (1);
        } else if (number < 0) {
            return (-1);
        } else {
            return (0);
        }
    }
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
