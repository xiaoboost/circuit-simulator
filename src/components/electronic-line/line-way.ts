import { SearchOption } from './node-search';
import { clonePrototype } from 'src/lib/utils';
import Point, { $P, PointLike } from 'src/lib/point';

/** 导线路径类 */
export class LineWay extends Array<Point> {
    static from(points: Point[] | PointLike[]) {
        const way = new LineWay(points.length);

        for (let i = 0; i < points.length; i++) {
            way[i] = $P(points[i]);
        }

        return way;
    }

    constructor(len = 0) {
        super(len);
    }

    /**
     * 导线节点坐标标准化
     * @param {number} [base=20]
     * @returns {this}
     */
    standardize(base: number = 20): this {
        for (let i = 0; i < this.length; i++) {
            this[i] = this[i].round(base);
        }
        return (this);
    }
    /**
     * 导线坐标整体偏移
     * @param {(Point | [number, number])} [bias=[0, 0]]
     * @returns {this}
     */
    offset(bias: Point | [number, number] = [0, 0]): this {
        for (let i = 0; i < this.length; i++) {
            this[i] = this[i].add(bias);
        }
        return (this);
    }
    /**
     * 去除节点冗余
     *  - 相邻三点共线或者相邻两点相等
     * @returns {this}
     */
    checkWayRepeat(): this {
        for (let i = 0; i < this.length - 2; i++) {
            if (
                ((this[i][0] === this[i + 1][0]) && (this[i + 1][0] === this[i + 2][0])) ||
                ((this[i][1] === this[i + 1][1]) && (this[i + 1][1] === this[i + 2][1])) ||
                ((this[i][0] === this[i + 1][0]) && (this[i][1] === this[i + 1][1]))
            ) {
                this.splice(i + 1, 1);
                i -= 2;

                if (i < -1) {
                    i = -1;
                }
            }
        }
        return (this);
    }
    checkWayExcess(option: SearchOption) {
        return this;
    }
    /**
     * 终点（起点）指向某点
     *  - 导线节点数量少于`1`则忽略
     * @param {Point} node
     * @param {('start' | 'end')} [dir='end']
     * @returns {this}
     */
    endToPoint(node: Point, mode: 'start' | 'end' = 'end'): this {
        if (this.length <= 1) {
            return this;
        }

        let last, prev;
        if (mode === 'end') {
            last = this.length - 1;
            prev = this.length - 2;
        }
        else if (mode === 'start') {
            last = 0;
            prev = 1;
        }
        else {
            throw new Error('LineWay: Illegal mode');
        }

        if (this[last][0] === this[prev][0]) {
            this[prev][0] = node[0];
        } else {
            this[prev][1] = node[1];
        }
        this[last] = $P(node);

        return this;
    }
    /**
     * 枚举导线中的所有节点
     *  - 回调的参数
     *     - point 当前节点坐标
     *     - index 当前节点的编号
     *     - segmentIndex 当前节点在导线的第几个线段
     * @param {(point: Point, index: number, segmentIndex: number) => void} callback
     */
    forEachPoint(callback: (point: Point, index: number, segmentIndex: number) => void) {
        let index = 0;

        for (let i = 0; i < this.length - 1; i++) {
            const vector = $P(this[i], this[i + 1]).sign().mul(20);

            for (
                let node = $P(this[i]);
                !node.isEqual(this[i + 1]);
                node = node.add(vector)
            ) {
                callback($P(node), i, index++);
            }
        }

        callback($P(this.get(-1)), this.length - 2, index);
    }
    /**
     * 枚举导线中的所有子路径
     *  - 回调的参数
     *     - way 当前子路径
     *     - index 当前子路径的编号
     * @param {(point: Point, index: number) => void} callback
     */
    forEachSubway(callback: (way: LineWay, index: number) => void) {
        let index = 0;

        for (let i = 0; i < this.length - 1; i++) {
            const vector = $P(this[i], this[i + 1]).sign().mul(20);
            const tempway = this.slice(0, i + 1);

            for (
                let node = $P(this[i]);
                !node.isEqual(this[i + 1]);
                node = node.add(vector)
            ) {
                const way = LineWay.from(tempway);

                if (!node.isEqual(way.get(-1))) {
                    way.push($P(node));
                }

                callback(way, index++);
            }
        }

        callback(LineWay.from(this), index);
    }
}

/** 导线搜索图 类 */
export class WayMap {
    /** 路径数据 */
    private _data: { [key: string]: LineWay } = {};

    has(node: Point) {
        return !!this._data[node.join(',')];
    }
    set(node: Point, way: LineWay) {
        this._data[node.join(',')] = way;
    }
    get(node: Point): LineWay | undefined {
        return this._data[node.join(',')];
    }
    delete(node: Point): boolean {
        return Reflect.deleteProperty(this._data, node.join(','));
    }
}

/**
 * TODO: 等待官方修复求函数参数列表的错误
 *  - @link: https://github.com/Microsoft/TypeScript/issues/26019
 *  - @link: https://github.com/Microsoft/TypeScript/issues/26136
 */
type LineWayKey = Exclude<keyof LineWay, keyof Array<Point>>;
export function LineWayCall<T extends LineWayKey>(way: Point[], name: T, ...args: any[]): ReturnType<LineWay[T]> {
    return LineWay.prototype[name].call(way, ...args);
}
