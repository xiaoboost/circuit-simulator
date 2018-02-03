import * as schMap from 'src/lib/map';
import * as assert from 'src/lib/assertion';

import { Rules } from './rules';
import { $P, Point } from 'src/lib/point';

import { Omit } from 'type-zoo';
import { ExchangeData } from './types';

export interface NodeData {
    position: Point;
    direction: Point;
    value: number;
    junction: number;
    straight: boolean;
    parent?: NodeData;
    cornerParent: NodeData;
}

interface MapData {
    [key: string]: NodeData;
}

// 全局四方向定义
const rotates = [
    [[1, 0], [0, 1]],       // 同向
    [[0, 1], [-1, 0]],      // 顺时针
    [[0, -1], [1, 0]],      // 逆时针
    [[-1, 0], [0, -1]],     // 反向
];

// 全局 worker 变量
const ctx: Worker = self as any;

// 外部对内通信的接口
ctx.addEventListener('message', ({ data }: MessageEvent) => {
    const exchange: ExchangeData = data[0];

    exchange.start = $P(exchange.start);
    exchange.end = $P(exchange.end);
    exchange.direction = $P(exchange.direction);
    exchange.endBias = exchange.endBias ? $P(exchange.endBias) : $P();

    schMap.forceUpdateMap(exchange.map, true);

    const result = AStartSearch(exchange);
    ctx.postMessage(result);
});

/** 调试时对外通信 */
function debug(args: { method: string; args?: any }) {
    true && ctx.postMessage({ code: 'debug', result: args });
}

/** 搜索用的临时图纸模块 */
class SearchMap {
    map: MapData;

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
        straight: true,
        cornerParent: (index > 0 ? node : node.cornerParent),
        junction: node.junction + (index > 0 ? 1 : 0),
        position: node.position.add(direction),
    };
}

function AStartSearch({ start, end, status, direction: originDirection, endBias = $P() }: Omit<ExchangeData, 'map'>) {
    const map = new SearchMap();
    const stack = new SearchStack(map);
    const rules = new Rules(start, end, status);

    // 方向偏移
    const sumDirection = endBias.add(start, -1).toUnit().add(originDirection);
    const direction = Math.abs(sumDirection[0]) > Math.abs(sumDirection[1]) ? $P(1, 0) : $P(0, 1);

    // 生成初始节点
    const first: NodeData = {
        position: start.mul(0.05),
        direction,
        junction: 0,
        value: 0,
        straight: true,
    } as any;

    // 起点的 cornerParent 等于其自身
    first.cornerParent = first;
    first.value = rules.calValue(first);
    stack.push(first);

    // 终点状态
    let endStatus: NodeData | undefined = void 0;

    // 检查起点
    if (rules.isEnd(first)) {
        endStatus = first;
    }

    debugger;
    // A*搜索，搜索极限为 300
    while (!endStatus && (stack.closeSize < 300)) {
        // 栈顶元素弹出为当前结点
        const nodenow = stack.shift();

        // 未处理的节点为空，终点无法达到
        if (!nodenow) {
            break;
        }
        debugger;

        // 调试用，插入当前节点，黑色
        if ($ENV.NODE_ENV === 'development') {
            debug({ method: 'point', args: [nodenow.position.mul(20), 'black'] });
        }

        // 按方向扩展
        for (let i = 0; i < 3; i++) {
            // 生成扩展节点
            const nodeExpand = newNode(nodenow, i);
            nodeExpand.value = rules.calValue(nodeExpand);

            // 判断是否是终点
            if (rules.isEnd(nodeExpand)) {
                endStatus = nodeExpand;
                break;
            }

            // 当前节点是否满足扩展要求
            if (rules.checkPoint(nodeExpand)) {
                stack.push(nodeExpand);
            } else {
                nodenow.straight = !i;
            }
        }

        // 没有可能路径，直接返回
        if (!stack.openSize && !endStatus) {
            return ([start]);
        }
    }

    if (!endStatus) {
        throw new Error('(node search) not found end.');
    }

    // 调试用，清除所有节点
    if ($ENV.NODE_ENV === 'development') {
        debug({ method: 'clearAll' });
    }

    // 终点回溯，生成路径
    const way = [];
    while (endStatus.parent && endStatus !== endStatus.cornerParent) {
        way.push($P(endStatus.position).mul(20));
        endStatus = endStatus.cornerParent;
    }

    way.push(start);
    way.reverse();
    return (way);
}
