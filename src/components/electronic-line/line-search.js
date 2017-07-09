import { $P } from '@/libraries/point';
import { schMap } from '@/libraries/maphash';

// 四方向
const rotate = [
    [[1, 0], [0, 1]],   //同相
    [[0, 1], [-1, 0]],  //顺时针
    [[0, -1], [1, 0]],  //逆时针
    [[-1, 0], [0, -1]]  //反相
];

// 导线路径类
function LineWay(args) {
    this.length = 0;

    if (!args) {
        args = [];
    } else if ($P.isPoint(args)) {
        args = [args];
    }

    args.forEach((n) => this.push(n));
}
LineWay.prototype = Object.create(Array.prototype);
LineWay.prototype[Symbol.isConcatSpreadable] = true;
Object.assign(LineWay.prototype, {
    constructor: LineWay,
    push(node) {
        this[this.length++] = $P(node);
        return (this.length);
    },
    unshift(...args) {
        const len = args.length;
        for (let i = this.length - 1; i >= 0; i--) {
            this[i + len] = this[i];
        }
        for (let i = 0; i < len; i++) {
            this[i] = $P(args[i]);
        }
        this.length = this.length + len;
        return (this.length);
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
            if (((this[i][0] === this[i + 1][0]) && (this[i + 1][0] === this[i + 2][0])) ||
                ((this[i][1] === this[i + 1][1]) && (this[i + 1][1] === this[i + 2][1])) ||
                ((this[i][0] === this[i + 1][0]) && (this[i][1] == this[i + 1][1]))) {
                this.splice(i + 1, 1);
                i -= 2;
                if (i < -1) i = -1;
            }
        }
        return (this);
    },
    // 去除路径冗余
    checkWayExcess() {
        return this;
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
});

// [点 -> 路径] 键值对 类
class WayMap {
    constructor(...args) {
        Object.defineProperty(this, 'size', {
            enumerable: false,
            configurable: false,
            value: 0
        });
        args.forEach(({ point, way }) => this.set(point. way));
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
            this.size ++;
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
            .forEach((n) => fn(WayMap.hashToKey(n), this[n], this ));
    }
}

/**
 * 搜索用的临时图纸模块
 * @returns {object}
 */
function SearchMap() {
    const self = {}, map = {};

    self.setValue = function(node, value) {
        if (!map[node[0]]) {
            map[node[0]] = [];
        }
        map[node[0]][node[1]] = value;
    };
    self.getValue = function(node) {
        if (!map[node[0]] || !map[node[0]][node[1]]) {
            return (false);
        }
        return (map[node[0]][node[1]]);
    };

    return (self);
}

/**
 * 搜索用的堆栈模块
 * @param {point} nodestart
 * @param {point} vector
 * @param {object} map
 * @returns {object}
 */
function SearchStack(start) {
    const self = {}, stack = [],
        hash = [], map = SearchMap();

    self.openSize = 0;
    self.closeSize = 0;

    self.shift = function() {
        const minValue = hash[0],
            shift = stack[minValue].pop();

        if (!stack[minValue].length) {
            delete stack[minValue];
            hash.shift();
        }
        self.openSize --;
        self.closeSize ++;
        return (shift);
    };
    self.push = function(node) {
        const value = node.value,
            status = map.getValue(node.point),
            column = stack[status.value];

        // 当前扩展状态估值比已有状态估值高，直接放弃
        if (status && (value > status.value)) {
            return;
        }
        // 取当前扩展点的状态，原状态从堆栈中抛弃
        if (status && column) {
            column.delete(status);
            if (!column.length) {
                delete stack[status.value];
                hash.delete(status.value);
            }
        }

        // 将状态插入 open 堆栈
        if (!stack[value]) {
            stack[value] = [];
            if (!hash.some((n, i, arr) =>
                (n > value) && arr.splice(i - 1, 0, value) || true)) {
                hash.push(value);
            }
        }
        stack[value].push(node);
        map.setValue(node.point, node);
        self.openSize ++;
    };

    return (self);
}

/**
 * 用于生成当前条件下的搜索规则
 * @param {point} start  - 起点
 * @param {point} end    - 终点
 * @param {object} opt   - 参数
 * @return {object} rule
 */
function SearchRules(start, end, opt) {

}

// 生成新节点
function newNode(node, rotate) {
    const ans = {};
    ans.vector = [
        node.vector[0] * rotate[0][0] + node.vector[1] * rotate[1][0],
        node.vector[0] * rotate[0][1] + node.vector[1] * rotate[1][1]
    ];
    ans.point = [
        node.point[0] + ans.vector[0],
        node.point[1] + ans.vector[1]
    ];
    return (ans);
}

/**
 * A* 路径搜索
 * @param {point} start   -  起点
 * @param {point} end     -  终点
 * @param {point} vector  -  初始向量
 * @param {object} opt    -  规则参数
 */
function AStartSearch(start, end, vector, opt) {
    // 初始化
    const rule = SearchRules(start, end, opt),
        stack = SearchStack();

    // 检查是否有结束标记
    if (rule.length) {
        return (rule);
    }

    // 装载起点
    const first = {
        point: start, junction: 0,
        parent: false, straight: true, vector
    };
    // 起点的 junctionParent 等于其自身
    first.junctionParent = first;
    first.value = rule.calValue(first);
    stack.push(first);

    let endStatus;
    // A*搜索，搜索极限为 300
    while (endStatus && (stack.closeSize < 300)) {
        // 栈顶元素弹出为当前结点
        const nodenow = stack.pop();

        // 三个方向扩展
        for (let i = 0; i < 3; i++) {
            // 生成扩展节点
            const nodeExpand = newNode(nodenow, rotate[i]);
            // 节点性质计算
            nodeExpand.straight = true;
            nodeExpand.parent = nodenow;
            nodeExpand.value = rule.calValue(nodeExpand);
            nodeExpand.junction = nodenow.junction + (!!i);
            nodeExpand.junctionParent = i ? nodenow : nodenow.junctionParent;
            // 判断是否是重点
            if (rule.checkEnd(nodeExpand)) {
                endStatus = nodeExpand;
                break;
            }
            // 当前节点是否满足扩展要求
            if (rule.checkPoint(nodeExpand)) {
                stack.push(nodeExpand);
            } else {
                nodenow.straight = (!i) ? false : nodenow.straight;
            }
        }
        // 没有可能路径，直接返回
        if (!stack.openSize && !endStatus) {
            return (new LineWay(start));
        }
    }
    // 终点回溯，生成路径
    const way = new LineWay();
    while (endStatus === endStatus.junctionParent) {
        way.push($P(endStatus.point).mul(20));
        endStatus = endStatus.junctionParent;
    }
    way.push($P(start));
    way.reverse();
    return (way);
}

// 绘图部分，预处理
function drawingStatus(point, onPart) {
    const ans = { process: 'drawing' },
        status = schMap.getValueByOrigin(point);

    if (status.type === 'line-point' ||
        status.type === 'cross-point' && status.connect.length === 3) {
        ans.status = 'point';
    } else if (status.type === 'line' ||
        status.type === 'cover-point' ||
        status.type === 'cross-point' && status.connect.length === 4) {
        ans.status = 'line';
    } else if (onPart) {
        debugger;
        ans.status = 'align';
        ans.align = point.closest(
            onPart.points
                .filter((n) => n.class['point-open'])
                .map((n) => n.position.add(onPart.position))
        );
    } else {
        ans.status = 'space';
    }

    return ans;
}

// 绘图部分
function drawing({ start, end, direction, way, gridWay, location, onPart }) {
    const mouseRound = end.round(),
        mouseFloor = end.floor(),
        locationL = $P(location),
        opt = drawingStatus(end, onPart),
        lastEnd = schMap.getValueByOrigin(way.get(-1));

    // 记录当前小四方格定位点
    location[0] = mouseFloor[0];
    location[1] = mouseFloor[1];

    let ans;
    debugger;
    if (opt.align && !opt.align.isEqual(way.get(-1))) {
        ans = AStartSearch(start, opt.align, direction, opt)
            .checkWayExcess(direction, opt);
    } else if (!mouseFloor.isEqual(locationL)) {
        const waysL = gridWay;
        gridWay = new WayMap();
        mouseFloor.toGrid().forEach((point) =>
            (waysL && waysL.has(point))
                ? gridWay.set(point, waysL.get(point))
                : gridWay.set(point,
                    AStartSearch(start, point, direction, opt)
                        .checkWayExcess(direction, opt)
                )
        );
    }

    // TODO: lastend 所在点需要缩小

    // 保存当前路径
    way.splice(0, way.length, ...ans);

    return ans;
}

// 导线路径搜索入口
function lineSearch(current, type) {
    if (type === 'drawing') {
        return drawing(current);
    }
}

export { lineSearch };
