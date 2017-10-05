/*
 * TODO: 在部分方法中，为了提高速度，会出现直接引用 $map 中数据的情况，虽然几率很小，但也可能会发生其中数据被无意更改的情况
 * 所以可以考虑存入 $map 的数据添加拦截器，所有的 set 操作均需要进一步验证，直接手动更改是不允许的
 */

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
     * @param {{} | [number, number]} data
     * @param {boolean} [large=false]
     */
    constructor(data, large = false) {
        if (Point.isPoint(data)) {
            const node = large ? $P(data).mul(0.05) : $P(data);
            const key = point2key(node);

            return Boolean($map[key])
                ? Object.clone($map[key])
                // TODO: isExist 键值可能需要改变，此值表示当前对象是否被修改过
                : { point: node, isExist: true };
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
        if (this.isExist) {
            return;
        }

        const key = point2key(this.point);
        $map[key] = Object.clone(this);
    }
    /**
     * 将当前数据与 $map 中已有的数据进行合并
     * 
     * @returns {void}
     */
    mergeMap() {
        if (this.isExist) {
            return;
        }

        const exclude = ['connect'],
            key = point2key(this.point),
            origin = $map[key];

        if (Boolean(origin)) {
            Object
                .keys(this)
                .filter((key) => !exclude.includes(key))
                .forEach((key) => (origin[key] = this[key]));

            this.connect
                .filter((point) => !origin.hasConnect(point))
                .forEach((point) => origin.connect.push(Array.from(point)));
        } else {
            $map[key] = Object.clone(this);
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
    alongTheLineBySmall(
        end = [Infinity, Infinity],
        vector = $P(end, this.point),
        large = false
    ) {
        const
            start = $P(this.point),
            unitVector = vector.sign();

        // 起点并不是导线或者起点等于终点，直接返回
        if (!this.isLine() || start.isEqual(end)) {
            return (start);
        }

        let node = $P(start),
            next = node.add(unitVector);
        // 当前点没有到达终点，还在导线所在直线内部，那就前进
        while (this.isLine.call($map[point2key(next)]) && !node.isEqual(end)) {
            if (this.hasConnect.call($map[point2key(node)], next)) {
                node = next;
                next = node.add(unitVector);
            } else {
                break;
            }
        }

        return node;
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
        .entries(data)
        .forEach(([key, value]) => (map[key] = value));
}

/**
 * new MapData(data, large) 运算的封装
 * @param {{} | [number, number]} data
 * @param {boolean} [large=false]
 * @returns {MapData}
 */
export function $MD(data, large = false) {
    return new MapData(data, large);
}
