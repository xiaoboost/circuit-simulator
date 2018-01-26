import { $P, Point } from 'src/lib/point';

/** 导线路径类 */
export class LineWay extends Array<Point> {
    constructor(args: Point[] = []) {
        super();
        args.forEach((n) => this.push($P(n)));
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
    /** 去除路径冗余 */
    checkWayExcess(): this {
        // TODO:
        return this;
    }
    /**
     * 路径是否相似
     *  - 除最后两个节点外全部相等
     * @param {LineWay} way
     * @returns {boolean}
     */
    isSimilar(way: LineWay): boolean {
        if (this.length !== way.length) {
            return (false);
        }
        for (let i = 0; i < this.length - 2; i++) {
            if (!(this[i].isEqual(way[i]))) {
                return (false);
            }
        }

        // FIXME: 最后两个点必须不等？
        return (
            (!this.get(-1).isEqual(way.get(-1))) &&
            (!this.get(-2).isEqual(way.get(-2)))
        );
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
     * 终点（起点）指向某线段
     *  - 导线节点数量少于`1`则忽略
     * @param {Point[]} line
     * @param {('start' | 'end')} [dir=1]
     * @returns {this}
     */
    // endToLine(line: Point[], point) {
    //     if (line[0][0] === line[1][0]) {
    //         // 竖
    //         this[this.length - 1][1] = point[1];
    //         this[this.length - 2][1] = point[1];
    //         this[this.length - 1][0] = line[0][0];
    //     } else {
    //         // 横
    //         this[this.length - 1][1] = line[0][1];
    //         this[this.length - 1][0] = point[0];
    //         this[this.length - 2][0] = point[0];
    //     }
    // }
}

/** 导线搜索图 类 */
export class WayMap {
    /** 路径数据 */
    private _data: { [key: string]: LineWay };

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
