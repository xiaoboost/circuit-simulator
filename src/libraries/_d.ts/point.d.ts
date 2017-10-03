/**
 * 点与向量的类
 * 
 * @export
 * @class Point
 */
export declare class Point {
    '0': number;
    '1': number;
    length: 2;
    constructor(start: (number[] | number | Point) = 0, end?: number[] | number | Point);

    /**
     * 加法：
     * 第一项将会调用 Point 构造函数生成实例，然后参与运算；
     * 第二项输入 -1 表示是减法，且 this 是被减数；
     * 
     * @param {(number[] | number | Point)} added
     * @param {(1 | -1)} [label=1] 
     * @returns {Point} 
     * @memberof Point
     */
    add(added: number[] | number | Point, label: 1 | -1 = 1): Point;
    /**
     * 乘法：
     * 第一项将会调用 Point 构造函数生成实例，然后参与运算；
     * 第二项输入 -1 表示是除法，且 this 是被除数；
     * 
     * @param {(number[] | number | Point)} multiplier
     * @param {(1 | -1)} [label=1] 
     * @returns {Point} 
     * @memberof Point
     */
    mul(multiplier: number[] | number | Point, label: 1 | -1 = 1): Point;
    /**
     * 向量乘法
     * 
     * @param {(number[] | number | Point)} vector 
     * @returns {number} 
     * @memberof Point
     */
    product(vector: number[] | number | Point): number;
    /**
     * 返回对 x, y 坐标分别求绝对值后组成的新 Point 实例
     * 
     * @returns {Point} 
     * @memberof Point
     */
    abs(): Point;
    /**
     * 返回 x, y 坐标分别单位化后组成的新 Point 实例
     * 
     * @returns {Point} 
     * @memberof Point
     */
    sign(): Point;
    /**
     * 求 this 到输入点的几何距离
     * 
     * @param {(number[] | number | Point)} point 
     * @returns {number} 
     * @memberof Point
     */
    distance(point: number[] | number | Point): number;
    /**
     * 求与 this 平行且模为 factor 的向量
     * 
     * @param {number} [factor=1] 
     * @returns {Point} 
     * @memberof Point
     */
    toUnit(factor: number = 1): Point;
    /**
     * x, y 分别对 n 的余数四舍五入
     * 
     * @param {number} [n=20] 
     * @returns {Point} 
     * @memberof Point
     */
    round(n: number = 20): Point;
    /**
     * 对 x, y 分别除以 n, 然后四舍五入
     * 
     * @param {number} [n=20] 
     * @returns {Point} 
     * @memberof Point
     */
    roundToSmall(n: number = 20): Point;
    /**
     * x, y 分别对 n 的余数向下取整
     * 
     * @param {number} [n=20] 
     * @returns {Point} 
     * @memberof Point
     */
    floor(n: number = 20): Point;
    /**
     * 对 x, y 分别除以 n, 然后向下取整
     * 
     * @param {number} [n=20] 
     * @returns {Point} 
     * @memberof Point
     */
    floorToSmall(n: number = 20): Point;
    /**
     * 是否是零向量
     * 
     * @returns {boolean} 
     * @memberof Point
     */
    isZero(): boolean;
    /**
     * x, y 值是否都是整数
     * 
     * @returns {boolean} 
     * @memberof Point
     */
    isInteger(): boolean;
    /**
     * 是否和输入向量平行
     * 
     * @param {(number[] | number | Point)} vector 
     * @returns {boolean} 
     * @memberof Point
     */
    isParallel(vector: number[] | number | Point): boolean;
    /**
     * 是否和输入向量垂直
     * 
     * @param {(number[] | number | Point)} vector 
     * @returns {boolean} 
     * @memberof Point
     */
    isVertical(vector: number[] | number | Point): boolean;
    /**
     * 是否和输入向量方向相同，如果输入向量是 0 向量，则输出 false
     * 
     * @param {(number[] | number | Point)} vector 
     * @returns {boolean} 
     * @memberof Point
     */
    isSameDire(vector: number[] | number | Point): boolean;
    /**
     * 是否和输入向量方向相反，如果输入向量是 0 向量，则输出 false
     * 
     * @param {(number[] | number | Point)} vector 
     * @returns {boolean} 
     * @memberof Point
     */
    isOppoDire(vector: number[] | number | Point): boolean;
    /**
     * 是否在线段内
     * 
     * @param {number[][]} segment 
     * @returns {boolean} 
     * @memberof Point
     */
    isInLine(segment: number[][]): boolean;
    /**
     * 以 this 中心点，margin 为四角四角顶点，如果范围内有坐标能使 fn 返回 true，那么该方法返回 true
     * 
     * @param {number[]} margin 
     * @param {(x: number, y: number, stop: () => void) => boolean} predicate 
     * @returns {boolean} 
     * @memberof Point
     */
    around(margin: number[], predicate: (x: number, y: number, stop: () => void) => boolean): boolean;
    /**
     * 以 this 为中心点，过滤距离中心点距离为 factor 的所有点，返回使 predicate 输出 true 的点的集合
     * 
     * @param {(point: [number, number]) => boolean} predicate 
     * @param {number} [factor=1] 
     * @returns {numer[][]} 
     * @memberof Point
     */
    aroundInf(predicate: (point: [number, number]) => boolean, factor: number = 1): numer[][];
    /**
     * 在 points 中与 this 距离最短的点
     * 
     * @param {((number[] | Point)[])} points 
     * @returns {(boolean | Point)} 
     * @memberof Point
     */
    closest(points: (number[] | Point)[]): boolean | Point;
    /**
     * 以 this 为左上角定点，生成边长为 len 的正方形四点
     * 
     * @param {number} [len=20] 
     * @returns {Point[]} 
     * @memberof Point
     */
    toGrid(len: number = 20): Point[];
    /**
     * 将坐标用 str 连接成字符串
     * 
     * @param {string} [str=','] 
     * @returns {string} 
     * @memberof Point
     */
    join(str: string = ','): string;
}

/**
 * new Point(start, end) 运算的封装
 * 
 * @export
 * @param {(number[] | number | Point)} [start=0] 
 * @param {(number[] | number | Point)} [end] 
 * @returns {Point} 
 */
export declare function $P(start: number[] | number | Point = 0, end?: number[] | number | Point): Point;
