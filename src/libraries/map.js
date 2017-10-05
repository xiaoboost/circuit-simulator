import { $P, Point } from 'src/libraries/point';

// 图纸标记缓存
const $map = {};

/**
 * 将坐标转化为标记数据中的键值
 * 
 * @param {Point} node
 * @returns {string}
 */
function point2key(node) {
    return node.join();
}

/**
 * 图纸标记数据类
 * 
 * @class MapData
 */
class MapData {
    /**
     * Creates an instance of MapData.
     * @param {{} | [number, number] | Point} data
     * @param {boolean} [large=false]
     */
    constructor(data, large = false) {
        if (Point.isPoint(data)) {
            const point = large ? $P(data).mul(0.05) : $P(data);
            const key = point2key(point);

            return $map[key]
                ? Object.clone($map[key])
                : { point };
        } else {
            return Object.clone(data);
        }
    }

    /**
     * 将当前数据覆盖到 Map 对应的点标记中
     *
     * @returns {void}
     */
    setMap() {
        const data = Object.clone(this);

        Object.freezeAll(data);
        $map[point2key(this.point)] = data;
    }
    /**
     * 将当前数据与 $map 中已有的数据进行合并
     * 
     * @returns {void}
     */
    mergeMap() {
        const exclude = ['connect'],
            key = point2key(this.point),
            origin = $map[key],
            ans = Object.clone();

        if (origin) {
            Object
                .keys(this)
                .filter((key) => !exclude.includes(key))
                .forEach((key) => (ans[key] = this[key]));

            this.connect
                .filter((point) => !origin.hasConnect(point))
                .forEach((point) => ans.connect.push(Array.from(point)));

            this.setMap.call(ans);
        } else {
            this.setMap();
        }
    }
    /**
     * 将当前点所指向的真实数据从 $map 中删除，返回值表示当前删除操作是否成功
     * 
     * @returns {boolean}
     */
    deleteDate() {
        return Reflect.deleteProperty($map, point2key(this.point));
    }
    /**
     * 当前实例的连接点中是否含有输入的节点坐标，如果输入点坐标和当前点相同，则输出 false
     * 
     * @param {Point | [number, number]} point
     * @param {boolean} [large=false]
     * @returns {boolean}
     */
    hasConnect(point, large = false) {
        if (!Point.isPoint(point)) {
            throw new Error('Must be a Point');
        }

        const node = large ? $P(point).mul(0.05) : $P(point);
        return this.connect.some((origin) => origin.isEqual(node));
    }
    /**
     * 给当前实例添加连接点，如果该连接点已经存在，则放弃操作
     * 
     * @param {Point | [number, number]} point
     * @param {boolean} [large=false]
     * @returns {void}
     */
    addConnect(point, large = false) {
        const node = large ? $P(point).mul(0.05) : $P(point);

        if (!this.hasConnect(node)) {
            this.connect.push(Array.from(node));
        }
    }
    /**
     * 从当前实例的连接点中删除输入点，如果输入点不存在，那么返回 false， 否则返回 true
     * 
     * @param {Point | [number, number]} point
     * @param {boolean} [large=false]
     * @returns {boolean}
     */
    deleteConnect(point, large = false) {
        const node = large ? $P(point).mul(0.05) : $P(point);
        const index = this.connect.findIndex((con) => con.isEqual(node));

        if (index === -1) {
            return (false);
        }

        this.connect.splice(index, 1);
        return (true);
    }
    /**
     * 当前点是否在导线上
     * 
     * @return {boolean}
     */
    isLine() {
        return (this && /^(line|cross-point|cover-point)$/.test(this.type));
    }
    /**
     * 以当前点为起点，沿着 vector 的方向，直到等于输入的 end，或者是导线方向与 vector 不相等，输出最后一点坐标
     * 
     * @param {Point | [number, number]} [end=[Infinity, Infinity]] 
     * @param {Point | [number, number]} [vector=$P(end, this.point)] 
     * @param {boolean} [large=false]
     * @returns {Point}
     */
    alongTheLine(
        end = [Infinity, Infinity],
        vector = $P(end, this.point),
        large = false
    ) {
        const start = $P(this.point),
            unitVector = vector.sign(),
            endPoint = large ? $P(end).mul(0.05) : $P(end);

        // 起点并不是导线或者起点等于终点，直接返回
        if (!this.isLine() || start.isEqual(endPoint)) {
            return (start);
        }

        let node = $P(start),
            next = node.add(unitVector);
        // 当前点没有到达终点，还在导线所在直线内部，那就前进
        while (this.isLine.call($map[point2key(next)]) && !node.isEqual(endPoint)) {
            if (this.hasConnect.call($map[point2key(node)], next)) {
                node = next;
                next = node.add(unitVector);
            } else {
                break;
            }
        }

        return large ? node.mul(20) : node;
    }
}

/**
 * 强制更新所有图纸标记
 * 
 * @param {string} [map='{}']
 * @return {void}
 */
export function forceUpdateMap(map = '{}') {
    const data = JSON.parse(map);

    Object
        .keys(map)
        .forEach((key) => Reflect.deleteProperty(map, key));

    Object
        .values(data)
        .forEach((value) => new MapData(value).setMap());
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
 * new MapData(data, large) 运算的封装
 * 
 * @param {{} | [number, number] | Point} data
 * @param {boolean} [large=false]
 * @returns {MapData}
 */
export function $MD(data, large = false) {
    return new MapData(data, large);
}
