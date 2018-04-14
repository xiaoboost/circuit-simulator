import * as utils from 'src/lib/utils';
import * as assert from 'src/lib/assertion';
import { $P, Point, PointLike } from 'src/lib/point';

export interface MapPointData {
    /**
     * 当前点属于哪个器件
     *
     * @type {string}
     */
    id: string;
    /**
     * 当前点的小坐标
     *  - 其乘以 20 才是实际坐标
     *
     * @type {Point}
     */
    point: Point;
    /**
     * 当前点的类型
     *
     * @type {string}
     */
    type: string;
    /**
     * 当前点在图纸中连接着另外哪些点
     *  - 只有导线才有此属性
     *
     * @type {Point[]}
     */
    connect?: Point[];
}

export interface MapData {
    [key: string]: MapPointData;
}

/**
 * 图纸标记缓存
 *  - key 是使用小坐标转换而来的，而内部数据中的 point 则是实际坐标，这点区别必须要注意
 *  - 之所以这么设计，是考虑到
 */
const $map: MapData = {};

/** 用于缓存强制更新的 string 数据 */
let $mapString = '';

/**
 * 将坐标转化为标记数据中的键值
 *
 * @param {PointLike} node
 * @returns {string}
 */
function point2key(node: PointLike): string {
    return node.join(',');
}

/**
 * 返回地图标记数据的副本
 * @param {MapPointData} data
 * @returns {MapPointData}
 */
function dataClone(data: MapPointData): MapPointData {
    const mustKeys = ['id', 'point', 'type', 'connect'];
    const ans = utils.clone(data);

    Object
        .keys(ans)
        .filter((key) => !mustKeys.includes(key))
        .forEach((key) => Reflect.deleteProperty(ans, key));

    return (ans);
}

/**
 * 将整个图纸数据用 JSON 字符串的形式输出
 *
 * @returns {string}
 */
export function outputMap() {
    return JSON.stringify($map);
}

/**
 * 强制更新所有图纸标记
 *
 * @param {string} [map='{}']
 * @param {boolean} [checkCache=false]
 * @return {void}
 */
export function forceUpdateMap(map = '{}', checkCache = false) {
    // 校验缓存
    if (checkCache && map === $mapString) {
        return;
    }

    const data = JSON.parse(map) as MapData;

    Object
        .keys($map)
        .forEach((key) => Reflect.deleteProperty($map, key));

    Object
        .values(data)
        .forEach((value: MapPointData) => setPoint(dataClone(value)));

    $mapString = map;
}

/**
 * 将数据写入图纸标记
 *  - 写入的数据是当前数据的副本
 *  - 如果指定点已经有数据，那么当前数据会直接覆盖它
 *
 * @export
 * @param {MapPointData} data
 * @param {boolean} [large=false]
 */
export function setPoint(data: MapPointData, large = false): void {
    data.point = (large ? data.point.mul(0.05) : $P(data.point));
    $map[point2key(data.point)] = dataClone(data);
}

/**
 * 将当前数据与 $map 中已有的数据进行合并
 *  - 写入的数据是当前数据的副本
 *  - 如果指定的点没有数据，那么将会直接写入当前数据
 *  - 合并规则如下：
 *    - point 不变
 *    - id, type 直接覆盖
 *    - connect 将会取两者的并集
 *
 * @export
 * @param {MapPointData} data
 * @param {boolean} [large=false]
 */
export function mergePoint(data: MapPointData, large = false): void {
    data.point = (large ? data.point.mul(0.05) : $P(data.point));

    const key = point2key(data.point);
    const newData = dataClone(data);
    const oriData = $map[key];

    if (!oriData) {
        $map[key] = newData;
    }

    if (
        assert.isArray(newData.connect) &&
        oriData && assert.isArray(oriData.connect)
    ) {
        newData.connect = newData.connect.concat(oriData.connect);
        newData.connect = newData.connect.unique(point2key);
    }

    $map[key] = newData;
}

/**
 * 此点是否含有数据
 *
 * @param {PointLike} point
 * @returns {boolean}
 */
export function hasPoint(point: PointLike, large = false): boolean {
    const node = (large ? Point.prototype.mul.call(point, 0.05) : $P(point)) as Point;

    return Boolean($map[point2key(node)]);
}

/**
 * 拿到 Map 中的标记数据
 *  - 这里拿到的数据只是副本，直接对这个对象进行操作并不会影响原数据
 *
 * @export
 * @param {PointLike} point
 * @param {boolean} [large=false]
 * @returns {(MapPointData | false)}
 */
export function getPoint(point: PointLike, large = false): MapPointData | undefined {
    const node = (large ? Point.prototype.mul.call(point, 0.05) : $P(point)) as Point;
    const data = $map[point2key(node)];

    return data ? dataClone(data) : undefined;
}

/**
 * 删除指定点数据，返回操作是否成功
 *
 * @returns {boolean}
 */
export function deletePoint(point: PointLike, large = false) {
    const node = (large ? Point.prototype.mul.call(point, 0.05) : $P(point)) as Point;
    return Reflect.deleteProperty($map, point2key(node));
}

/**
 * point 点是否连接了 connect
 *  - 如果 point 没有 connect 属性，则会输出 false，并再控制台显示警告
 *  - 如果 point, connect 在数学意义上是相等的，则输出 false
 *
 * @export
 * @param {PointLike} point
 * @param {PointLike} connect
 * @param {boolean} [large=false]
 * @returns {boolean}
 */
export function hasConnect(point: PointLike, connect: PointLike, large = false): boolean {
    const origin = (large ? Point.prototype.mul.call(point, 0.05) : point) as Point;
    const check = (large ? Point.prototype.mul.call(connect, 0.05) : connect) as Point;
    const data = $map[point2key(origin)];

    if (!data) {
        throw new Error('(map) space point.');
    }

    if (!data.connect) {
        throw new Error('(map) this point do not have connect.');
    }

    return data.connect.some((item) => item.isEqual(check));
}

/**
 * 给指定点添加连接点
 *  - 如果当前点没有 connect ，则放弃操作
 *  - 如果该连接点已经存在，则放弃操作
 *
 * @export
 * @param {PointLike} point
 * @param {PointLike} connect
 * @param {boolean} [large=false]
 * @returns {void}
 */
export function addConnect(point: PointLike, connect: PointLike, large = false): void {
    const origin = (large ? Point.prototype.mul.call(point, 0.05) : $P(point)) as Point;
    const check = (large ? Point.prototype.mul.call(connect, 0.05) : $P(connect)) as Point;
    const data = $map[point2key(origin)];

    if (!data) {
        throw new Error('(map) space point.');
    }

    if (!data.connect) {
        throw new Error('(map) this point do not have connect.');
    }

    if (!hasConnect(origin, check)) {
        data.connect.push($P(check));
    }
}

/**
 * 从当前实例的连接点中删除输入点
 *  - 如果输入点不存在，那么返回 false， 否则返回 true
 *
 * @export
 * @param {PointLike} point
 * @param {PointLike} connect
 * @param {boolean} [large=false]
 * @returns {boolean}
 */
export function deleteConnect(point: PointLike, connect: PointLike, large = false): boolean {
    const origin = (large ? Point.prototype.mul.call(point, 0.05) : $P(point)) as Point;
    const check = (large ? Point.prototype.mul.call(connect, 0.05) : $P(connect)) as Point;
    const data = $map[point2key(origin)];

    if (!data) {
        throw new Error('(map) space point.');
    }

    if (!data.connect) {
        throw new Error('(map) this point do not have connect.');
    }

    return data.connect.delete((node) => node.isEqual(check));
}

/**
 * 当前点是否在导线上
 *
 * @return {boolean}
 */
export function isLine(point: PointLike, large = false) {
    const node = (large ? Point.prototype.mul.call(point, 0.05) : point) as Point;

    const data = $map[point2key(node)];
    return (
        Boolean(data) &&
        /^(line|cross-point|cover-point)/.test(data.type)
    );
}

/**
 * 以当前点为起点，沿着 vector 的方向，直到等于输入的 end，或者是导线方向与 vector 不相等的点，输出最后一点坐标
 *
 * @export
 * @param {PointLike} start
 * @param {PointLike} [end=[Infinity, Infinity]]
 * @param {PointLike} [vector=$P(end, start)]
 * @param {boolean} [large=false]
 * @returns {Point}
 */
export function alongTheLine(
    start: PointLike,
    end: PointLike = [Infinity, Infinity],
    vector: PointLike = $P(start, end),
    large: boolean = false,
): Point {
    const uVector = $P(vector).sign(),
        sNode = large ? $P(start).mul(0.05) : $P(start),
        eNode = large ? $P(end).mul(0.05) : $P(end);

    // 起点并不是导线或者起点等于终点，直接返回
    if (!isLine(sNode) || sNode.isEqual(eNode)) {
        return (new Point(start));
    }

    let node = sNode, next = node.add(uVector);
    // 当前点没有到达终点，还在导线所在直线内部，那就前进
    while (isLine(next) && !node.isEqual(eNode)) {
        if (hasConnect(node, next)) {
            node = next;
            next = node.add(uVector);
        } else {
            break;
        }
    }

    return large ? node.mul(20) : node;
}
