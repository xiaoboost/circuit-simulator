import Vue from 'vue';
import { Point } from 'src/lib/point';
import { LineWay, WayMap } from './line-way';
import ElectronPart from 'src/components/electronic-part';

import { Omit } from 'type-zoo';

/** 导线端点 */
export interface LinePoint {
    position: Point;
    class: {
        'line-point-open': boolean;
        'line-point-part': boolean;
        'line-point-cross': boolean;
    };
}

/** 导线组件对外接口 */
export interface ComponentInterface extends LineData, Vue {
    focus: boolean;
    points: LinePoint[];
    pointSize: number[];

    markSign(): void;
    deleteSign(): void;

    /**
     * 导线反转
     */
    reverse(): void;
    /**
     * 是否存在连接
     * @param {string} id 待检验的连接
     * @returns {boolean}
     */
    hasConnect(id: string): boolean;
    /**
     * 释放导线连接
     * @param {(0 | 1)} [index]
     */
    freeConnect(index?: 0 | 1): void;
    /**
     * 删除连接
     * @param {string} id 待删除的连接
     */
    deleteConnect(id: string): void;
    /**
     * 判断输入坐标是当前导线的起点还是终点
     * @param {Point} node
     * @returns {(-1 | 0 | 1)}
     */
    findConnectIndex(node: Point): -1 | 0 | 1;
    /**
     * 由路径信息设置导线端点连接
     * @param {(0 | 1)} [index]
     */
    setConnectByWay(index?: 0 | 1): void;
    /**
     * 指定连接所连接的器件，将这些器件所连接的 this.id 替换成 newId
     * @param {(0 | 1)} index 连接标号
     * @param {string} newId 替换的 id
     */
    replaceConnect(index: 0 | 1, newId: string): void;
    /**
     * 合并导线
     * @param {string} id 待连接导线的 id
     */
    concat(id: string): void;
    /**
     * 拆分导线
     * @param {string} id 被拆分导线的 id
     * @param {(0 | 1)} index 当前导线的起点/终点作为分割点
     */
    split(id: string, index: 0 | 1): void;
}

/** 导线数据接口 */
export interface LineData {
    way: Point[];
    readonly id: string;
    readonly type: 'line';
    readonly hash: string;
    readonly connect: string[];
}

/** 调试返回的数据格式 */
export interface DebugData {
    method: string;
    args: any[];
}

/** 导线搜索数据接口 */
export interface ExchangeData {
    start: Point;
    end: Point;
    status: string;
    direction: Point;
    endBias?: Point;
}

interface SearchTempData {
    /** 当前鼠标偏移量 */
    mouseBais: Point;
    /** 当前绘图数据缓存 */
    wayMap: WayMap;
    /** 鼠标覆盖器件状态 */
    onPart?: {
        status: 'over' | 'leave';
        part: ElectronPart;
        pointIndex: number;
    };
}

/** 单点搜索参数 */
export type DrawingOption =
    Omit<ExchangeData, 'status'> &
    { temp: SearchTempData };
