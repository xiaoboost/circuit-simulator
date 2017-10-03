type PointLike = [number, number] | Point;
type PointInput = PointLike | number;

/**
 * 点和向量类
 *
 * @class Point
 */
class Point {
    /**
     * 检测输入是否是标准点对象
     *
     * @static
     * @param {*} point
     * @returns {boolean}
     * @memberof Point
     */
    static isPoint(point: any): boolean {
        return (
            point instanceof Point ||
            (point instanceof Object &&
            typeof point[0] === 'number' &&
            typeof point[1] === 'number')
        );
    }

    [0]: number;
    [1]: number;
    length: 2;

    /**
     * Creates an instance of Point.
     * @param {PointInput} start
     * @param {PointInput} [end]
     * @memberof Point
     */
    constructor(start: PointInput, end?: PointInput) {
        if (typeof start === 'number') {
            // 输入一（或二）个数
            this[0] = start;
            this[1] = !Number.isNaN(+end) ? +end : start;
        } else if (Point.isPoint(end) && !Point.isPoint(end)) {
            // 输入一个点
            this[0] = start[0];
            this[1] = start[1];
        } else if (Point.isPoint(start) && Point.isPoint(start)) {
            // 输入是两个点，当作向量处理
            this[0] = end[0] - start[0];
            this[1] = end[1] - start[1];
        }

        Object.defineProperty(this, 'length', {
            writable: false,
            enumerable: false,
            configurable: false,
            value: 2,
        });
    }

    /**
     * 加法：
     * 第一项将会调用 Point 构造函数生成实例，然后参与运算；
     * 第二项输入 -1 表示是减法，且 this 是被减数；
     *
     * @param {PointInput} added
     * @param {number} [label=1]
     * @returns {Point}
     * @memberof Point
     */
    add(added: PointInput, label: number = 1): Point {
        let sum = void 0;
        if (typeof added === 'number') {
            sum = new Point(
                this[0] + added * label,
                this[1] + added * label,
            );
        } else if (Point.isPoint(added)) {
            sum = new Point(
                this[0] + added[0] * label,
                this[1] + added[1] * label,
            );
        }
        return (sum);
    }
    /**
     * 乘法：
     * 第一项将会调用 Point 构造函数生成实例，然后参与运算；
     * 第二项输入 -1 表示是除法，且 this 是被除数；
     *
     * @param {PointInput} multiplier
     * @param {number} [label=1]
     * @returns {Point}
     * @memberof Point
     */
    mul(multiplier: PointInput, label: number = 1): Point {
        let sum = void 0;
        if (typeof multiplier === 'number') {
            sum = new Point(
                this[0] * ((label < 0) ? (1 / (- multiplier)) : multiplier),
                this[1] * ((label < 0) ? (1 / (- multiplier)) : multiplier),
            );
        } else if (Point.isPoint(multiplier)) {
            sum = new Point(
                this[0] * ((label < 0) ? (1 / (- multiplier[0])) : multiplier[0]),
                this[1] * ((label < 0) ? (1 / (- multiplier[1])) : multiplier[1]),
            );
        }
        return (sum);
    }
    /**
     * 向量乘法
     *
     * @param {PointLike} vector
     * @returns {number}
     * @memberof Point
     */
    product(vector: PointLike): number {
        return (this[0] * vector[0] + this[1] * vector[1]);
    }
    /**
     * 返回对 x, y 坐标分别求绝对值后组成的新 Point 实例
     *
     * @returns {Point}
     * @memberof Point
     */
    abs(): Point {
        return (new Point(
            Math.abs(this[0]),
            Math.abs(this[1]),
        ));
    }
    /**
     * 返回 x, y 坐标分别单位化后组成的新 Point 实例
     *
     * @returns {Point}
     * @memberof Point
     */
    sign(): Point {
        return (new Point(
            Math.sign(this[0]),
            Math.sign(this[1]),
        ));
    }
    /**
     * 求 this 到 point 的几何距离
     *
     * @param {PointLike} point
     * @returns {number}
     * @memberof Point
     */
    distance(point: PointLike): number {
        return Math.hypot(
            (this[0] - point[0]),
            (this[1] - point[1]),
        );
    }
    /**
     * 求与 this 平行且模为 factor 的向量
     *
     * @param {number} [factor=1]
     * @returns {Point}
     * @memberof Point
     */
    toUnit(factor: number = 1): Point {
        const scale = 1 / this.distance([0, 0]);
        return this.mul(scale * factor);
    }
    /**
     * x, y 分别对 n 的余数四舍五入
     *
     * @param {number} [fixed=20]
     * @returns {Point}
     * @memberof Point
     */
    round(fixed: number = 20): Point {
        return (new Point(
            Number.parseInt((this[0] / fixed).toFixed()) * fixed,
            Number.parseInt((this[1] / fixed).toFixed()) * fixed,
        ));
    }
    /**
     * 对 x, y 分别除以 n, 然后四舍五入
     *
     * @param {number} [fixed=20]
     * @returns {Point}
     * @memberof Point
     */
    roundToSmall(fixed: number = 20): Point {
        return (new Point(
            Number.parseInt((this[0] / fixed).toFixed()),
            Number.parseInt((this[1] / fixed).toFixed()),
        ));
    }
    /**
     * x, y 分别对 n 的余数向下取整
     *
     * @param {number} [fixed=20]
     * @returns {Point}
     * @memberof Point
     */
    floor(fixed: number = 20): Point {
        return (new Point(
            Math.floor(this[0] / fixed) * fixed,
            Math.floor(this[1] / fixed) * fixed,
        ));
    }
    /**
     * 对 x, y 分别除以 n, 然后向下取整
     *
     * @param {number} [fixed=20]
     * @returns {Point}
     * @memberof Point
     */
    floorToSmall(fixed: number = 20): Point {
        return (new Point(
            Math.floor(this[0] / fixed),
            Math.floor(this[1] / fixed),
        ));
    }
    /**
     * 是否是零向量
     *
     * @returns {boolean}
     * @memberof Point
     */
    isZero(): boolean {
        return (this[0] === 0 && this[1] === 0);
    }
    /**
     * 是否是整数点
     *
     * @returns {boolean}
     * @memberof Point
     */
    isInteger(): boolean {
        return (
            this.length === 2 &&
            this[0] === Math.floor(this[0]) &&
            this[1] === Math.floor(this[1])
        );
    }
    /**
     * 是否和输入向量平行
     *
     * @param {PointLike} vector
     * @returns {boolean}
     * @memberof Point
     */
    isParallel(vector: PointLike): boolean {
        return (!vector[0] && !vector[1])
            ? false
            : (this[0] * vector[1] === this[1] * vector[0]);
    }
    /**
     * 是否和输入向量垂直
     *
     * @param {PointLike} vector
     * @returns {boolean}
     * @memberof Point
     */
    isVertical(vector: PointLike): boolean {
        return (!(this[0] * vector[0] + this[1] * vector[1]));
    }
    /**
     * 是否和输入向量方向相同。
     * 如果输入向量是 0 向量，则输出 false
     *
     * @param {PointLike} vector
     * @returns {boolean}
     * @memberof Point
     */
    isSameDire(vector: PointLike): boolean {
        return (
            this.isParallel(vector) &&
            (vector[0] * this[0]) > 0
        );
    }
    /**
     * 是否和输入向量方向相反。
     * 如果输入向量是 0 向量，则输出 false
     *
     * @param {PointLike} vector
     * @returns {boolean}
     * @memberof Point
     */
    isOppoDire(vector: PointLike): boolean {
        return (
            this.isParallel(vector) &&
            (vector[0] * this[0]) < 0
        );
    }
    /**
     * 是否在线段内
     *
     * @param {PointLike[]} segment
     * @returns {boolean}
     * @memberof Point
     */
    isInLine(segment: PointLike[]): boolean {
        // 点到线段两端的向量方向相反，即表示其在线段内
        const toStart = new Point(this, segment[0]),
            toEnd = new Point(this, (segment[1] || [Infinity, Infinity]));

        return (
            toEnd.isZero() ||
            toStart.isZero() ||
            toStart.isOppoDire(toEnd)
        );
    }
    /**
     * 以 this 中心点，margin 为四角顶点，如果范围内有坐标能使 predicate 返回 true，那么该方法返回 true
     *
     * @param {number[]} margin
     * @param {(x: number, y: number, stop: () => void) => boolean} predicate
     * @returns {boolean}
     * @memberof Point
     */
    around(margin: number[], predicate: (x: number, y: number, stop: () => void) => boolean): boolean {
        let label = false;
        const stop = () => (label = true);

        for (let i = this[0] + margin[0][0]; i <= this[0] + margin[1][0]; i++) {
            for (let j = this[1] + margin[0][1]; j <= this[1] + margin[1][1]; j++) {
                predicate(i, j, stop);
                if (label) { return (false); }
            }
        }
        return (true);
    }
    /**
     * 以 this 为中心点，过滤距离中心点距离为 factor 的所有点，返回使 predicate 输出 true 的点的集合
     *
     * @param {(point: PointLike) => boolean} predicate
     * @param {number} [factor=1]
     * @returns {Point[]}
     * @memberof Point
     */
    aroundInf(predicate: (point: PointLike) => boolean, factor: number = 1): Point[] {
        const ans: Point[] = predicate(this) ? [new Point(this)] : [];

        for (let m = 1; !ans.length; m++) {
            for (let i = 0; i < m; i++) {
                const x = i * factor, y = (m - i) * factor,
                    around = (!x)
                        ? [[0, y], [0, -y], [y, 0], [-y, 0]]
                        : [[x, y], [x, -y], [-x, y], [-x, -y]],
                    points = around.map((n) => this.add(n as [number, number]));

                ans.push(...points.filter(predicate));

                if (ans.length) { break; }
            }
        }
        return ans;
    }
    /**
     * 以 this 为左上角定点，生成边长为 len 的正方形四点
     *
     * @param {PointLike[]} points
     * @returns {(boolean | Point)}
     * @memberof Point
     */
    closest(points: PointLike[]): boolean | Point {
        return !points.length
            ? false
            : new Point(points.reduce(
                (pre, next) =>
                    this.distance(pre) < this.distance(next) ? pre : next,
            ));
    }
    /**
     * 以当前点为左上角，生成四方格坐标
     *
     * @param {number} [len=20]
     * @returns {[Point, Point, Point, Point]}
     * @memberof Point
     */
    toGrid(len: number = 20): [Point, Point, Point, Point] {
        return ([
            new Point(this),
            new Point(this[0] + len, this[1]),
            new Point(this[0], this[1] + len),
            new Point(this[0] + len, this[1] + len),
        ]);
    }
    /**
     * 将坐标用 str 连接成字符串
     *
     * @param {string} [str=',']
     * @returns
     * @memberof Point
     */
    join(str: string = ',') {
        return `${this[0]}${str}${this[1]}`;
    }
}

/**
 * new Point(start, end) 运算的封装
 *
 * @param {PointInput} [start=[0, 0]]
 * @param {PointInput} [end]
 * @returns {Point}
 */
function $P(start: PointInput = [0, 0], end?: PointInput): Point {
    return (new Point(start, end));
}

export { $P, Point };
