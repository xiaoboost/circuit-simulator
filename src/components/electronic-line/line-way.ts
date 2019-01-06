import { SearchOption } from './node-search';
import Point, { PointLike } from 'src/lib/point';

/** 导线路径类 */
export class LineWay extends Array<Point> {
    static from(points: Point[] | PointLike[]) {
        const way = new LineWay(points.length);

        for (let i = 0; i < points.length; i++) {
            way[i] = Point.from(points[i]);
        }

        return way;
    }

    constructor(len = 0) {
        super(len);
    }

    /** 导线节点坐标标准化 */
    standardize(base: number = 20): this {
        for (let i = 0; i < this.length; i++) {
            this[i] = this[i].round(base);
        }
        return (this);
    }
    /** 导线坐标整体偏移 */
    offset(bias: Point | [number, number] = [0, 0]): this {
        for (let i = 0; i < this.length; i++) {
            this[i] = this[i].add(bias);
        }
        return (this);
    }
    /**
     * 去除节点冗余
     *  - 相邻三点共线或者相邻两点相等
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
        }
        else {
            this[prev][1] = node[1];
        }
        this[last] = Point.from(node);

        return this;
    }

    /**
     * 终点（起点）指向某线段
     *  - 导线节点数量少于`1`则忽略
     */
    endToLine(line: Point[] | number[][]): this {
        return this;
    }

    /** 获取当前线段的方向 */
    getSubWayVector(index: number) {
        return new Point(this[index], this[index + 1]).sign().mul(20);
    }

    /** 生成导线途径所有点的迭代器 */
    eachPoint() {
        let index = 0;
        let node = Point.from(this[0]);
        let vector = LineWayCall(this, 'getSubWayVector', 0);

        const next = () => {
            const result = {
                value: node,
                done: node.isEqual(this.get(-1)),
            };

            node = node.add(vector);

            if (
                index < this.length - 2 &&
                node.isEqual(this[index + 1])
            ) {
                index++;
                vector = LineWayCall(this, 'getSubWayVector', index);
            }

            return result;
        };

        return { [Symbol.iterator]: () => ({ next }) };
    }
}

/** 导线搜索图类 */
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

type LineWayKey = Exclude<keyof LineWay, keyof Point[]>;
export function LineWayCall<T extends LineWayKey>(way: Point[], name: T, ...args: Parameters<LineWay[T]>): ReturnType<LineWay[T]> {
    return (LineWay.prototype[name] as any).call(way, ...args);
}
