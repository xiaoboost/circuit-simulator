import * as schMap from 'src/lib/map';
import { nodeSearch } from './node-search';
import { $P, Point, PointLike } from 'src/lib/point';

import { ExchangeData } from './types';

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
    /** 去除路径冗余 */
    checkWayExcess(option: ExchangeData): this {
        this.checkWayRepeat();

        // 当前导线节点小于 3，不需要去除冗余
        if (this.length <= 3) {
            return (this);
        }

        // 设置修正时的参数
        const opt = {
            ...option,
            status: `${option.status}-modified`,
        };

        // 不需要终点偏移
        delete opt.endBias;

        // 如果优先出线方向和第二个线段方向相同，说明此处需要修正
        if (opt.direction.isSameDirection($P(this[1], this[2]))) {
            this.splice(0, 3, ...nodeSearch({
                ...opt,
                start: this[0],
                end: this[2],
            }));
            this.checkWayRepeat();
        }

        for (let i = 0; i < this.length - 3; i++) {
            const vector = $P(this[i], this[i + 1]).sign();
            const vectorNextNext = $P(this[i + 2], this[i + 3]).sign();

            // 同向修饰
            if (vector.isEqual(vectorNextNext)) {
                const tempWay = nodeSearch({
                    ...opt,
                    direction: vector,
                    start: this[i + 1],
                    end: this[i + 3],
                });

                if (
                    (tempWay.length < 4) &&
                    $P(tempWay[0], tempWay[1]).isSameDirection(vector)
                ) {
                    this.splice(i + 1, 3, ...tempWay);
                    this.checkWayRepeat();
                    i--;
                }
            }
            // 反向修饰，导线必须大于 4
            else if (this.length > 4) {
                const tempWay = nodeSearch({
                    ...opt,
                    direction: vector,
                    start: this[i],
                    end: this[i + 3],
                });

                if (tempWay.length < 4) {
                    this.splice(i, 4, ...tempWay);
                    this.checkWayRepeat();
                    i--;
                }
            }
        }

        this.checkWayRepeat();
        return (this);
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

    /**
     * 导线扩展
     * @param node 尝试将导线扩展至此点
     */
    expendInLine(node: Point) {
        if (this.has(node)) {
            return;
        }

        /** 检查两个点的状态是否相同 */
        function sameMapStatus(node1: PointLike, node2: PointLike): boolean {
            const status1 = schMap.getPoint(node1, true);
            const status2 = schMap.getPoint(node2, true);

            return (
                (!status1 && !status2) ||
                (!!status1 && !!status2 && status1.type === status2.type)
            );
        }

        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

        directions.forEach((direction) => {
            const checkNode = node.add(direction, 20);
            const lineway = this.get(checkNode);

            // 此方向不存在导线或者当前点和检查点状态不同都不允许扩展
            if (!lineway || !sameMapStatus(node, checkNode)) {
                return;
            }

            // 当前点在导线最后一段线段中
            if (node.isInLine([lineway.get(-1), lineway.get(-2)])) {
                const way = LineWay.from(lineway);
                way[way.length - 1] = $P(node);
                this.set(node, way);
            }
        });
    }
}
