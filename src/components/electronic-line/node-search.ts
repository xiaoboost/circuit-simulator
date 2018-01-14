import Rules from './rules';
import { $P, Point } from 'src/lib/point';

interface NodeData {
    position: Point;
    direction: Point;
    value: number;
    junction: number;
    straight: boolean;
    parent?: NodeData;
    cornerParent?: NodeData;
}

interface MapData {
    [key: string]: NodeData;
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

export default function AStartSearch(start: Point, end: Point, rules: Rules) {
    const map = new SearchMap();
    const stack = new SearchStack(map);
}
