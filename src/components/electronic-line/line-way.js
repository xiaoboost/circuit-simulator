import { $P } from '@/libraries/point';

// 导线路径类
function LineWay(args) {
    this.length = 0;

    if (!args) {
        args = [];
    } else if ($P.isPoint(args)) {
        args = [args];
    }

    args.forEach((n) => this.push($P(n)));
}
LineWay.prototype = Object.create(Array.prototype);
LineWay.prototype[Symbol.isConcatSpreadable] = true;
Object.assign(LineWay.prototype, {
    constructor: LineWay,
    push(...nodes) {
        return Array.prototype.push.call(this, ...nodes.map((n) => $P(n)));
    },
    unshift(...nodes) {
        return Array.prototype.unshift.call(this, ...nodes.map((n) => $P(n)));
    },
    // 路径标准化
    standardize(bias) {
        for (let i = 0; i < this.length; i++) {
            this[i] = bias
                ? this[i].add(bias).round()
                : this[i].round();
        }
        return (this);
    },
    // 去除节点冗余
    checkWayRepeat() {
        for (let i = 0; i < this.length - 2; i++) {
            // 相邻三点共线或者相邻两点相等
            if (((this[i][0] === this[i + 1][0]) && (this[i + 1][0] === this[i + 2][0])) ||
                ((this[i][1] === this[i + 1][1]) && (this[i + 1][1] === this[i + 2][1])) ||
                ((this[i][0] === this[i + 1][0]) && (this[i][1] === this[i + 1][1]))) {
                this.splice(i + 1, 1);
                i -= 2;
                if (i < -1) { i = -1; }
            }
        }
        return (this);
    },
    // 去除路径冗余
    checkWayExcess() {
        return this;
    },
    // 路径有且仅有最后两个节点不同
    isSimilar(tempway) {
        if (this.length !== tempway.length) {
            return (false);
        }
        for (let i = 0; i < this.length - 2; i++) {
            if (!(this[i].isEqual(tempway[i]))) {
                return (false);
            }
        }
        return (
            (!this.get(-1).isEqual(tempway.get(-1))) &&
            (!this.get(-2).isEqual(tempway.get(-2)))
        );
    },
    // 终点/起点指向指定坐标
    endToMouse(node, dir = 1) {
        if (this.length <= 1) { return; }

        const end = (dir === 1) ? this.length - 1 : 0,
            last = (dir === 1) ? this.length - 2 : 1;

        if (this[end][0] === this[last][0]) {
            this[last][0] = node[0];
        } else {
            this[last][1] = node[1];
        }
        this[end] = $P(node);
    },
    // 终点指向指定线段
    endToLine(line, point) {
        if (line[0][0] === line[1][0]) {
            // 竖
            this[this.length - 1][1] = point[1];
            this[this.length - 2][1] = point[1];
            this[this.length - 1][0] = line[0][0];
        } else {
            // 横
            this[this.length - 1][1] = line[0][1];
            this[this.length - 1][0] = point[0];
            this[this.length - 2][0] = point[0];
        }
    },
});

// [点 -> 路径] 键值对
class WayMap {
    constructor() {
        this.size = 0;
    }
    // 将键转换为内部 hash 的键
    static keyToHash(key) {
        return (key[0] * 5 + key[1] * 0.05);
    }
    // 内部 hash 值转换为键
    static hashToKey(hash) {
        const ans = [], temp = hash % 100;
        ans[1] = temp * 20;
        ans[0] = (hash - temp) * 0.2;
        return ($P(ans));
    }

    get(key) {
        return (this[WayMap.keyToHash(key)]);
    }
    has(key) {
        return (!!this.get(key));
    }
    clear() {
        Object.keys(this).forEach((n) => delete this[n]);
    }
    /**
     * 设置键值对
     * @param {point} key
     * @param {LineWay} value
     * @param {boolean} [fn=() => true]
     *  - 判断函数，当设置键值被占用时有效，输入实参为被占用的键值
     *  - 返回 true 则用新值替代之，否则当前键值不变
     * @memberof WayMap
     */
    set(key, value, fn = () => true) {
        const hash = WayMap.keyToHash(key);

        if (this[hash]) {
            this[hash] = fn(this[hash]) ? value : this[hash];
        } else {
            this.size++;
            this[hash] = value;
        }
    }
    keys() {
        return Object.keys(this)
            .filter((n) => !Number.isNaN(+n))
            .map((n) => WayMap.hashToKey(n));
    }
    ways() {
        return Object.keys(this)
            .filter((n) => !Number.isNaN(+n))
            .map((n) => this[n]);
    }
    forEach(fn) {
        this.keys(this)
            .filter((n) => !Number.isNaN(+n))
            .forEach((n) => fn(WayMap.hashToKey(n), this[n], this));
    }
}

export { LineWay, WayMap };
