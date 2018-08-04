import { Rules } from './search-rules';
import { LineWay } from './line-way';
import Point, { $P } from 'src/lib/point';

/** 搜索用节点数据 */
export interface NodeData {
    position: Point;
    direction: Point;
    value: number;
    junction: number;
    parent?: NodeData;
    cornerParent: NodeData;
}

/** 节点搜索选项接口 */
export interface SearchOption {
    start: Point;
    end: Point;
    status: string;
    direction: Point;
    endBias?: Point;
}

// 全局四方向定义
const rotates = [
    [[1, 0], [0, 1]],       // 同向
    [[0, 1], [-1, 0]],      // 顺时针
    [[0, -1], [1, 0]],      // 逆时针
    [[-1, 0], [0, -1]],     // 反向
];

/** 搜索用的临时图纸模块 */
class SearchMap {
    map: { [key: string]: NodeData };

    constructor() {
        this.map = {};
    }
    get(node: Point): undefined | NodeData {
        return this.map[node.join(',')];
    }
    set(node: Point, value: NodeData) {
        this.map[node.join()] = value;
    }
}

class SearchStack {
    /** 堆栈数据 */
    stack: { [key: number]: NodeData[] } = {};
    /** 堆栈 hash 记录表 */
    hash: number[] = [];
    /** 未处理数据大小 */
    openSize = 0;
    /** 已处理数据大小 */
    closeSize = 0;

    /** 搜索图数据记录 */
    map: SearchMap;

    constructor(map: SearchMap) {
        this.map = map;
    }

    shift() {
        const minValue = this.hash[0];
        const shift = this.stack[minValue].pop();

        if (this.stack[minValue].length === 0) {
            delete this.stack[minValue];
            this.hash.shift();
        }

        this.openSize--;
        this.closeSize++;
        return (shift);
    }
    push(node: NodeData) {
        const value = node.value;
        const origin = this.map.get(node.position);
        const dataColumn = origin && this.stack[origin.value];

        // 当前扩展状态估值比已有状态估值高，则放弃
        if (origin && (value > origin.value)) {
            return;
        }

        // 删除原数据
        if (origin && dataColumn) {
            dataColumn.delete(origin);

            if (dataColumn.length === 0) {
                delete this.stack[origin.value];
                this.hash.delete(origin.value);
            }
        }

        // 如果 value 在堆栈中不存在对应的数据列，新建数据列
        if (!this.stack[value]) {
            this.stack[value] = [];

            this.hash.push(value);
            this.hash.sort((pre, next) => pre > next ? 1 : -1);
        }

        // 当前数据加入堆栈
        this.stack[value].push(node);
        this.map.set(node.position, node);
        this.openSize++;
    }
}

/** 生成新节点 */
function newNode(node: NodeData, index: number): NodeData {
    const rotate = rotates[index];
    const direction = $P([
        node.direction[0] * rotate[0][0] + node.direction[1] * rotate[1][0],
        node.direction[0] * rotate[0][1] + node.direction[1] * rotate[1][1],
    ]);

    return {
        direction,
        value: 0,
        parent: node,
        cornerParent: (index > 0 ? node : node.cornerParent),
        junction: node.junction + (index > 0 ? 1 : 0),
        position: node.position.add(direction),
    };
}

export function nodeSearch({
    start,
    end,
    status,
    direction: originDirection,
    endBias = start,
}: SearchOption): LineWay {
    const map = new SearchMap();
    const stack = new SearchStack(map);
    const rules = new Rules(start, end, status);

    // 方向偏移
    const sumDirection = endBias.add(start, -1).sign().add(originDirection);
    const direction = Math.abs(sumDirection[0]) > Math.abs(sumDirection[1])
        ? $P(sumDirection[0], 0).sign()
        : $P(0, sumDirection[1]).sign();

    // 生成初始节点
    const first: NodeData = {
        position: start.mul(0.05),
        direction,
        junction: 0,
        value: 0,
    } as any;

    // 起点的 cornerParent 等于其自身
    first.cornerParent = first;
    first.value = rules.calValue(first);
    stack.push(first);

    // 调试用时，指示终点
    if (process.env.NODE_ENV === 'development') {
        $debugger.point(first.position, 'red', 20);
    }

    // 终点状态
    let endStatus: NodeData | undefined = void 0;

    // 检查起点
    if (rules.isEnd(first)) {
        endStatus = first;
    }

    // A*搜索，搜索极限为 300
    while (!endStatus && (stack.closeSize < 300)) {
        // 栈顶元素弹出为当前结点
        const nodenow = stack.shift();

        // 未处理的节点为空，终点无法达到
        if (!nodenow) {
            break;
        }

        if (process.env.NODE_ENV === 'development') {
            $debugger.point(nodenow.position, 'blue', 20);
        }

        // 按方向扩展
        for (let i = 0; i < 3; i++) {
            // 生成扩展节点
            const nodeExpand = newNode(nodenow, i);
            nodeExpand.value = rules.calValue(nodeExpand);

            if (process.env.NODE_ENV === 'development') {
                $debugger.point(nodeExpand.position, 'black', 20);
            }

            // 判断是否是终点
            if (rules.isEnd(nodeExpand)) {
                endStatus = nodeExpand;
                break;
            }

            // 当前节点是否满足扩展要求
            if (rules.checkPoint(nodeExpand)) {
                stack.push(nodeExpand);
            }
        }

        // 没有可能路径，直接返回
        if (!stack.openSize && !endStatus) {
            return (LineWay.from([start]));
        }
    }

    if (process.env.NODE_ENV === 'development') {
        $debugger.clearAll();
    }

    if (!endStatus) {
        throw new Error('(node search) not found end.');
    }

    // 终点回溯，生成路径
    const way = new LineWay();
    while (endStatus.parent && endStatus !== endStatus.cornerParent) {
        way.push($P(endStatus.position).mul(20));
        endStatus = endStatus.cornerParent;
    }

    way.push(start);
    way.reverse();
    return (way);
}
