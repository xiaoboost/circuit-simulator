import { NodeSearchOption } from './node-search';
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
    checkWayExcess(option: NodeSearchOption) {
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
     * 导线形状相似
     *  - 节点数量相同
     *  - 只有最后两个节点不同
     *  - 最后两个节点组成的线段平行
     */
    isSimilar(line: Point[]) {
        if (this.length !== line.length) {
            return false;
        }

        if (this.length < 2) {
            return true;
        }

        for (let i = 0; i < this.length - 2; i++) {
            if (!this[i].isEqual(line[i])) {
                return false;
            }
        }

        const selfSegment = new Point(this.get(-1), this.get(-2));
        const inputSegment = new Point(line.get(-1), line.get(-2));

        return selfSegment.isParallel(inputSegment);
    }

    /**
     * 终点（起点）指向某线段
     *  - 导线节点数量少于`3`则忽略
     *  - 输入线段必定与`this`平行
     */
    endToLine(segment: Point[] | number[][], mouse: Point): this {
        if (this.length < 3) {
            return this;
        }

        const byMouse = segment[0][0] === segment[1][0] ? 1 : 0;

        this.get(-2)[byMouse] = mouse[byMouse];
        this.get(-1)[byMouse] = mouse[byMouse];

        return this;
    }

    /** 获取当前线段的方向 */
    getSubWayVector(index: number) {
        return new Point(this[index], this[index + 1]).sign().mul(20);
    }

    /** 生成导线途径所有点的迭代器 */
    *eachPoint() {
        let index = 0;
        let node = Point.from(this[0]);
        let vector = LineWayCall(this, 'getSubWayVector', 0);

        while (!node.isEqual(this.get(-1))) {
            yield node;

            node = node.add(vector);

            if (
                index < this.length - 2 &&
                node.isEqual(this[index + 1])
            ) {
                index++;
                vector = LineWayCall(this, 'getSubWayVector', index);
            }
        }

        yield node;
    }
}

/** 导线搜索图类 */
export class WayMap {
    /** 路径数据 */
    private _data: AnyObject<LineWay> = {};

    static toKey(node: Point) {
        return node.join(',');
    }

    has(node: Point) {
        return Boolean(this._data[WayMap.toKey(node)]);
    }
    set(node: Point, way: LineWay) {
        this._data[WayMap.toKey(node)] = way;
    }
    get(node: Point): LineWay | undefined {
        return this._data[WayMap.toKey(node)];
    }
    delete(node: Point): boolean {
        return Reflect.deleteProperty(this._data, WayMap.toKey(node));
    }
}

type LineWayKey = Exclude<keyof LineWay, keyof Point[]>;
export function LineWayCall<T extends LineWayKey>(way: Point[], name: T, ...args: Parameters<LineWay[T]>): ReturnType<LineWay[T]> {
    return (LineWay.prototype[name] as any).call(way, ...args);
}
