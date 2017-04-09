// 深复制
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
    isEmpty: (from) => !!Object.keys(from).length,
    // 深复制对象
    clone: (from) => Object.keys(from)
        .reduce((obj, key) => (obj[key] = clone(from[key]), obj), {}),
    // 隐藏所有可枚举的属性
    hideAll: (obj) => Object.keys(obj).forEach((key) => Object.defineProperty(obj, key, {
        configurable: false,
        writable: false,
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

        return thisKeys.every((key) => this[key].isEqual
            ? this[key].isEqual(obj[key])
            : this[key] === obj[key]
        );
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

        return this.every((item, i) => item.isEqual
            ? item.isEqual(arr[i])
            : item === arr[i]
        );
    },
    //取出下标为index的元素
    get(index) {
        const sub = (index >= 0)
            ? index
            : this.length + index;

        return (index >= 0 || index < this.length)
            ? this[sub]
            : false;
    }
});

// 隐藏所有扩展的原生属性
Object.hideAll(Array);
Object.hideAll(Object);
Object.hideAll(Object.prototype);
Object.hideAll(Array.prototype);
Object.hideAll(Number.prototype);
Object.hideAll(String.prototype);

// 网页禁止右键和选中
window.document.oncontextmenu = () => false;
