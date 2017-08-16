import { $P } from '@/libraries/point';
import { schMap } from '@/libraries/maphash';
import { LineWay, WayMap } from './line-way';

// 四方向
const rotate = [
    [[1, 0], [0, 1]],   // 同相
    [[0, 1], [-1, 0]],  // 顺时针
    [[0, -1], [1, 0]],  // 逆时针
    [[-1, 0], [0, -1]],  // 反相
];

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
function SearchStack() {
    const self = {}, stack = {},
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
        self.openSize--;
        self.closeSize++;
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
            if (hash.every((n, i, arr) => {
                if (n > value) {
                    arr.splice(i, 0, value);
                    return false;
                } else {
                    return true;
                }
            })) {
                hash.push(value);
            }
        }
        stack[value].push(node);
        map.setValue(node.point, node);
        self.openSize++;
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
function SearchRules(nodeStart, nodeEnd, mode) {
    const self = {},
        endLines = [],      // 终点等效的线段
        excludeParts = [],  // 需要排除的器件
        excludeLines = [],  // 需要排除的导线
        start = nodeStart.mul(0.05),
        end = nodeEnd.mul(0.05);

    // 返回 node 所在器件
    function getPart(node) {
        const status = schMap.getValueBySmalle(node);
        if (status.type === 'part') {
            return status.id;
        } else if (status.type === 'part-point') {
            return status.id.split('-')[0];
        }
    }
    // 返回 node 所在线段
    function getSegment(node) {
        if (!schMap.isLineBySmall(node)) {
            return [];
        }

        const ans = [];
        for (let i = 0; i < 2; i++) {
            const temp = [[1, 0], [-1, 0], [0, -1], [0, 1]],
                limit = [
                    schMap.alongTheLineBySmall(node, undefined, temp[i * 2]),
                    schMap.alongTheLineBySmall(node, undefined, temp[i * 2 + 1]),
                ];
            if (!limit[0].isEqual(limit[1])) {
                ans.push(limit);
            }
        }
        return ans;
    }
    // node 是否在某线段内
    function isNodeInLine(node, line) {
        return node.isInLine(line);
    }
    // 距离表征，以直角三角形直角边之和表征斜边
    function distance(a, b) {
        return (
            Math.abs(a[0] - b[0]) +
            Math.abs(a[1] - b[1])
        );
    }
    // node 所在线段是否和当前节点方向垂直
    function isNodeVerticalLine(node) {
        const status = schMap.getValueBySmalle(node.point);
        return status.connect.every(
            (connect) =>
                $P(node.point, connect).isVertical(node.direction)
        );
    }

    // 价值估算
    // node 到终点距离 + 拐弯数量
    function calToPoint(node) {
        return (
            distance(end, node.point) +
            node.junction
        );
    }

    // 终点判定
    // 等于终点
    function isEndPoint(node) {
        return end.isEqual(node.point);
    }
    // 在终线中
    // function isInEndLines(node) {
    //     return endLines.find((line) => isNodeInLine(node.point, line));
    // }
    // 绘制导线时，终点在导线中
    function checkNodeInLineWhenDraw(node) {
        // 优先判断是否等于终点
        if (node.point.isEqual(end)) {
            return (true);
        }
        // 是否在终点等效线段中
        const exLine = isNodeInLine(node.point);
        // 不在等效终线中
        if (!exLine) {
            return false;
        }
        // 当前路径是直线
        if (!node.junction) {
            return true;
        }
        // 所在等效线段方向和当前节点的关系
        if (($P(exLine)).isParallel(node.direction)) {
            // 等效线段和当前节点方向平行
            return true;
        } else {
            // 等效线段和当前节点方向垂直
            const junction = node.junctionParent.direction,
                node2End = $P(node.point, end);

            return (node2End.isOppoDire(junction));
        }
    }

    // 节点能否扩展
    // 点对点普通状态
    function isLegalPointWhenSpace(node) {
        const status = schMap.getValueBySmalle(node.point);
        if (!status) {
            // 空节点
            return true;
        } else if (status.type === 'part') {
            // 器件节点
            return false;
        } else if (status.type === 'part-point') {
            // 当前节点在引脚时在终点周围距离为1的地方都可行
            return (distance(node.point, end) < 2);
        } else if (schMap.isLineBySmall(node.point)) {
            // 当前节点方向必须和所在导线方向垂直
            return (isNodeVerticalLine(node));
        } else {
            return (true);
        }
    }
    // 点对点强制对齐
    function isLegalPointWhenAlign(node) {
        const status = schMap.getValueBySmalle(node.point);
        if (!status) {
            return true;
        } else if (status.type === 'part') {
            return false;
        } else if (status.type === 'part-point') {
            // 必须等于终点
            return (node.point.isEqual(end));
        } else if (schMap.isLineBySmall(node.point)) {
            return (isNodeVerticalLine(node));
        } else {
            return (true);
        }
    }
    // 排除指定器件
    function isLegalPointExcludePart(node) {
        const status = schMap.getValueBySmalle(node.point);
        if (!status) {
            return (true);
        } else if (status.type === 'part') {
            return excludeParts.includes(status.id);
        } else if (status.type === 'part-point') {
            const [part] = status.id.split('-');
            return (
                excludeParts.includes(part) ||
                distance(node.point, end) < 2
            );
        } else if (schMap.isLineBySmall(node.point)) {
            return (isNodeVerticalLine(node));
        } else {
            return (true);
        }
    }
    // 排除指定线段
    // function isLegalPointExcludeLine(node) {
    //     const status = schMap.getValueBySmalle(node.point);
    //     if (!status) {
    //         return (true);
    //     } else if (/part/.test(status.type)) {
    //         return (false);
    //     } else if (schMap.isLineBySmall(node.point)) {
    //         return excludeLines.some((line) => isNodeInLine(node.point, line));
    //     } else {
    //         return (true);
    //     }
    // }

    // 根据输入模式指定规则
    if (mode.process === 'drawing') {
        // 绘制情况下，end 只可能是点，根据终点属性来分类
        const status = schMap.getValueBySmalle(end);
        // 节点估值
        self.calValue = calToPoint;

        if (schMap.isLineBySmall(end)) {
            // 终点在导线上
            endLines.push(...getSegment(end));
            self.isEnd = checkNodeInLineWhenDraw;
            self.checkPoint = isLegalPointWhenAlign;
        } else if (status.type === 'part-point') {
            // 终点是器件引脚
            self.isEnd = isEndPoint;
            self.checkPoint = isLegalPointWhenAlign;
        } else if (status.type === 'part') {
            // 终点在器件上
            excludeParts.push(getPart(end));
            self.isEnd = isEndPoint;
            self.checkPoint = isLegalPointExcludePart;
        } else {
            // 一般状态
            self.isEnd = isEndPoint;
            self.checkPoint = isLegalPointWhenSpace;
        }
    }

    // 当前节点允许的扩展数量
    self.limitExpand = function(node) {
        if (schMap.isLineBySmall(node.point)) {
            if (node.point.isEqual(start)) {
                return (4);
            } else if (excludeLines.some((line) =>
                isNodeInLine(node.point, line))) {
                return (3);
            } else {
                return (1);
            }
        } else {
            return (3);
        }
    };
    // 调试用函数
    self.insertDebugNode = window.$debug
        ? (a, b, c) => window.$debug.point(a, b, c)
        : () => {};
    self.clearDebug = window.$debug
        ? () => window.$debug.clearAll()
        : () => {};

    return self;
}

// 生成新节点
function newNode(node, rotate) {
    const ans = {};
    ans.direction = [
        node.direction[0] * rotate[0][0] + node.direction[1] * rotate[1][0],
        node.direction[0] * rotate[0][1] + node.direction[1] * rotate[1][1],
    ];
    ans.point = [
        node.point[0] + ans.direction[0],
        node.point[1] + ans.direction[1],
    ];
    return (ans);
}

// 合并初始方向和起点->终点向量
function mergeInitSearch(init, search) {
    const merge = init.sign().add(search.sign()),
        absMerge = merge.abs();

    if (absMerge[0] === absMerge[1]) {
        return $P(init);
    } else if (absMerge[0] > absMerge[1]) {
        return $P(Math.sign(merge[0]), 0);
    } else {
        return $P(0, Math.sign(merge[1]));
    }
}

/**
 * A* 路径搜索
 * @param {point} start   -  起点
 * @param {point} end     -  终点
 * @param {point} vector  -  初始向量
 * @param {object} opt    -  规则参数
 */
function AStartSearch(start, end, direction, opt) {
    // 初始化
    const stack = SearchStack(),
        rule = SearchRules(start, end, opt),
        first = {
            direction, point: start.mul(0.05),
            junction: 0, parent: false, straight: true,
        };

    // 起点的 junctionParent 等于其自身
    first.junctionParent = first;
    first.value = rule.calValue(first);
    stack.push(first);

    let endStatus;
    // 检查起点
    if (rule.isEnd(first)) {
        endStatus = first;
    }

    // A*搜索，搜索极限为 300
    while (!endStatus && (stack.closeSize < 300)) {
        // 栈顶元素弹出为当前结点
        const nodenow = stack.shift(),
            limit = rule.limitExpand(nodenow);

        rule.insertDebugNode(nodenow.point, 'blue', 20);
        // 按方向扩展
        for (let i = 0; i < limit; i++) {
            // 生成扩展节点
            const nodeExpand = newNode(nodenow, rotate[i]);
            // 节点性质计算
            nodeExpand.straight = true;
            nodeExpand.parent = nodenow;
            nodeExpand.junction = nodenow.junction + (!!i);
            nodeExpand.junctionParent = i ? nodenow : nodenow.junctionParent;
            nodeExpand.value = rule.calValue(nodeExpand);
            rule.insertDebugNode(nodeExpand.point, 'black', 20);
            // 判断是否是终点
            if (rule.isEnd(nodeExpand)) {
                rule.clearDebug();
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
    while (endStatus.parent && endStatus !== endStatus.junctionParent) {
        way.push($P(endStatus.point).mul(20));
        endStatus = endStatus.junctionParent;
    }
    way.push(start);
    way.reverse();
    return (way);
}

// 绘图部分，预处理
function drawingStatus(point, onPart) {
    const ans = { process: 'drawing' },
        status = schMap.getValueByOrigin(point);

    if (status.type === 'line-point' ||
        status.type === 'cross-point' &&
        status.connect.length === 3) {
        ans.status = 'point';
    } else if (status.type === 'line' ||
        status.type === 'cover-point' ||
        status.type === 'cross-point' &&
        status.connect.length === 4) {
        ans.status = 'line';
    } else if (onPart) {
        debugger;
        ans.align = point.closest(
            onPart.points
                .filter((n) => n.class['point-open'])
                .map((n) => n.position.add(onPart.position))
        );
        ans.status = ans.align ? 'align' : 'part';
    } else {
        ans.status = 'space';
    }

    return ans;
}

export default {
    methods: {
        setPointSize(point, size = -1) {
            if (!point) { return; }

            const status = schMap.getValueByOrigin(point);
            if (status.type === 'part-point') {
                const [id, mark] = status.split('-'),
                    part = this.$parent.find(id);

                part.pointSize.$set(mark, size);
            } else if (/line-point|cross-point/.test(status.type)) {
                status.id.split(' ').forEach((id) => {
                    const line = this.$parent.find(id),
                        mark = [line.way[0], line.way.get(-1)]
                            .findIndex((p) => p.isEqual(point));

                    if (mark !== -1) {
                        line.pointSize.$set(mark, size);
                    }
                });
            }
        },
        drawing({ start, end, direction, onPart, last }) {
            const endRound = end.round(),
                endFloor = end.floor(),
                endGrid = endFloor.toGrid(),
                locationL = $P(last.location),
                opt = drawingStatus(endRound, onPart);

            // 记录当前小四方格定位点
            last.location = $P(endFloor);
            // 旧路径终点所在器件端点缩小
            this.setPointSize(this.way.get(-1), -1);

            if (opt.align && !opt.align.isEqual(this.way.get(-1))) {
                this.way =
                    AStartSearch(start, opt.align, direction, opt)
                        .checkWayExcess(direction, opt);
            } else if (!endFloor.isEqual(locationL)) {
                const waysL = last.gridWay,
                    ways = last.gridWay = new WayMap(),
                    vector = mergeInitSearch(direction, $P(start, end));

                endGrid.forEach((point) =>
                    (waysL && waysL.has(point))
                        ? ways.set(point, waysL.get(point))
                        : ways.set(point,
                            AStartSearch(start, point, vector, opt)
                                .checkWayExcess(vector, opt)
                        )
                );
            }

            // 默认当前导线终点节点缩小
            this.pointSize.$set(1, 2);

            const ways = last.gridWay;
            if (opt.status === 'line') {
                // 终点在导线上
                // 与鼠标四舍五入的点相连坐标集合与四方格坐标集合的交集
                const status = schMap.getValueByOrigin(endRound),
                    roundSet = status.connect.filter((con) =>
                        endGrid.find((p) => p.mul(0.05).isEqual(con)) &&
                        schMap.getValueBySmalle(con).type !== 'part-point'
                    );

                // 交集不为空
                if (roundSet.length) {
                    // 交集中离鼠标最近的点
                    const closest = end.closest(roundSet),
                        roundWay = ways.get(endRound);

                    // 导线最后两个节点不同
                    if (roundWay.isSimilar(endGrid.get(closest))) {
                        this.way = new LineWay(roundWay);
                        this.way.endToLine([endRound, closest], end);
                    }
                } else {
                    this.way = ways.get(endRound);
                }
            } else if (opt.status === 'point') {
                // 主动对齐模式，选取对齐点为路径
                this.way = ways.get(endRound);
                this.setPointSize(this.way.get(-1), 5);
            } else if (opt.status === 'align') {
                // 强制对齐模式
                this.setPointSize(this.way.get(-1), 5);
            } else {
                // 普通状态，选取节点最多的路径
                const key = endGrid.reduce(
                    (pre, next) =>
                        (ways.get(pre).length >= ways.get(next).length)
                            ? pre : next
                );
                this.way = new LineWay(ways.get(key));
                this.way.endToMouse(end);
                // 普通状态，导线末端节点保持放大
                this.pointSize.$set(1, 8);
            }
        },
        drawEnd({ start, direction }) {
            const endRound = this.way.get(-1).round(),
                status = schMap.getValueByOrigin(endRound);

            // 起点和终点相等或者只有一个点，则删除当前导线
            if (this.way.length < 2 || endRound.isEqual(start)) {
                this.$store.commit('DELETE_LINE', this.id);
                return (false);
            }

            let end = endRound;
            // 当前节点被占用，需要重新确定终点
            if (status.type === 'part' || (status.type === 'part-point' && status.connect.length)) {
                end = $P(
                    endRound
                        .aroundInf((node) => schMap.getValueByOrigin(node), 20)
                        .reduce((pre, next) =>
                            end.distance(pre) < end.distance(next) ? pre : next
                        )
                );
            }

            // 以新终点重新计算路径
            this.way = AStartSearch(start, end, direction, { process: 'modified' })
                .checkWayExcess(direction, 'drawEnd');

            this.setConnectByWay(1);
            this.$emit('focus', this.id, ...this.connect.join(' ').split(' '));
        },
    },
};
