import Point from 'src/lib/point';

import * as Map from 'src/lib/map';
import { isUndef } from 'src/lib/utils';
import { LineWay } from './line-way';
import { nodeSearch } from './node-search';

import LineComponent from '..';
import PartComponent from '../../electronic-part';

/** 绘制状态选项 */
export interface Option {
    /** 起点 */
    start: Point;
    /** 终点 */
    end: Point;
    /** 方向 */
    direction: Point;
    /** 当前鼠标偏移量 */
    mouseBais: Point;
    /** 当前绘图数据缓存 */
    cache: Cache;
    /** 导线端点大小控制数组 */
    pointSize: number[];
    /** 鼠标状态 */
    mouseOver: {
        status: Mouse.Idle;
        recover?(): void;
    } | {
        status: Mouse.Part;
        part: PartComponent;
        recover?(): void;
    } | {
        status: Mouse.Line;
        line: LineComponent;
        recover?(): void;
    };
}

/** 鼠标指向的状态 */
export const enum Mouse {
    /** 鼠标指向为控 */
    Idle,
    /** 鼠标指向器件 */
    Part,
    /** 鼠标指向导线 */
    Line,
}

/** 搜索状态 */
export const enum Status {
    /** 普通状态 */
    Space = 10,
    /** 对齐引脚 */
    AlignPoint,
    /** 对齐导线 */
    AlignLine,
    /** 导线修饰 */
    Modification,
}

/** 搜索缓存 */
export class Cache {
    /** 搜索数据 */
    private _data: AnyObject<LineWay | undefined> = {};
    /** 当前搜索的起点 */
    private _start: Point;
    /** 当前搜索的起始方向 */
    private _direction: Point;

    constructor(start: Point, direction: Point) {
        this._start = start;
        this._direction = direction;
    }

    /** 输入转换为特征值 */
    private toKey(end: Point, bias: Point) {
        const { _start: start, _direction: origin } = this;
        const direction = new Point(start, end);

        // 方向与初始方向相反
        if (!direction.isZero && direction.isOppoDirection(origin)) {
            debugger;
            // 偏移量向原始方向的垂直向量投影
            const vertical = bias.toProjection(origin.toVertical()).toUnit();
            // 终点-偏移量 合成标记
            return (`${end.join(',')}-${vertical.join(',')}`);
        }
        else {
            return end.join(',');
        }
    }

    has(end: Point, bias: Point) {
        return isUndef(this._data[this.toKey(end, bias)]);
    }

    set(end: Point, bias: Point, way: LineWay) {
        this._data[this.toKey(end, bias)] = way;
    }

    get(end: Point, bias: Point) {
        return this._data[this.toKey(end, bias)];
    }

    delete(end: Point, bias: Point) {
        return Reflect.deleteProperty(this._data, this.toKey(end, bias));
    }
}

function setSearchConfig(params: Option) {
    const { start, end, pointSize, mouseOver, mouseBais } = params;

    // 当前终点四方格左上角顶点
    const vertex = end.floor();
    // 四方格坐标
    const endGrid = vertex.toGrid();

    let ends: Point[] = [];
    let status = Status.Space;

    // 导线终点默认最大半径
    pointSize.$set(1, 8);

    // 引脚复位
    if (mouseOver.recover) {
        mouseOver.recover();
        mouseOver.recover = undefined;
    }

    // 终点在器件上
    if (mouseOver.status === Mouse.Part) {
        const points = mouseOver.part.points.map((point) => point.position);
        const mouseToPart = new Point(mouseOver.part.position, end.add(mouseBais));
        const idlePoint = points.filter((_, i) => !mouseOver.part.connect[i]);

        // 允许直接对齐
        if (idlePoint.length > 0) {
            // 导线终点缩小
            pointSize.$set(1, 2);

            // 优先对齐的引脚
            const allowPoint = mouseToPart.minAngle(idlePoint);
            const index = points.findIndex((node) => node.isEqual(allowPoint));

            // 该引脚缩放
            mouseOver.part.pointSize.$set(index, 2);
            // 缩放状态复位函数
            mouseOver.recover = () => mouseOver.part.pointSize.$set(index, -1);

            // 点对齐状态
            status = Status.AlignPoint;
            // 终点只有需要对齐的点
            ends = [allowPoint.add(mouseOver.part.position)];
        }
        // 不允许直接对齐
        else {
            ends = endGrid;
        }
    }
    // 终点在导线上
    else if (mouseOver.status === Mouse.Line) {
        const mouseRound = end.round();
        const mouseStatus = Map.getPoint(mouseRound, true)!;

        // 导线交错节点或者是空闲节点，则直接对齐
        if (
            mouseStatus.type === Map.NodeType.LinePoint ||
            mouseStatus.type === Map.NodeType.LineCrossPoint
        ) {
            status = Status.AlignPoint;
            ends = [mouseRound];
        }
        // 否则选取四方格中在导线上的点
        else {
            status = Status.AlignLine;
            ends = endGrid.filter((node) => Map.isLine(node, true));
        }
    }
    // 终点闲置
    else {
        ends = endGrid;
    }

    // 按照到起点的距离，由大到小排序
    if (ends.length > 1) {
        ends = ends.sort(
            (pre, next) =>
                pre.distance(start) > next.distance(start) ? -1 : 1,
        );
    }

    // 当前终点集合的中心点作为终点偏移量
    const endBias = ends.reduce((ans, node) => ans.add(node), new Point(0, 0)).mul(1 / ends.length);

    return {
        ...params,
        status,
        ends,
        endBias,
    };
}

function searchWay(params: ReturnType<typeof setSearchConfig>) {
    const { start, end, endBias, cache, direction, status, ends } = params;

    // 节点搜索选项
    const option = {
        start,
        direction,
        status,
        end: new Point(0, 0),
        endBias: end.floor().add(10),
    };

    // 搜索路径
    for (const point of ends) {
        if (cache.has(point, endBias)) {
            continue;
        }

        // 设置当前搜索终点
        option.end = point;

        // 搜索并修饰
        const tempWay = nodeSearch(option).checkWayExcess({
            ...option,
            status: Status.Modification,
        });

        // 记录当前搜索结果
        cache.set(point, endBias, tempWay);
    }

    return { ...params };
}

function setWayPath(params: ReturnType<typeof searchWay>) {
    const { end, endBias, cache, pointSize, status, ends } = params;

    let way: LineWay;

    if (status === Status.AlignPoint) {
        way = LineWay.from(cache.get(ends[0], endBias)!);
    }
    else if (status === Status.AlignLine) {
        const endRound = end.round();
        const endRoundWay = cache.get(endRound, endBias)!;
        // 与<终点四舍五入的点>相连的坐标集合与四方格坐标集合的交集
        const roundSet = ends.filter((node) => {
            if (Map.hasConnect(endRound, node, true)) {
                const endStatus = Map.getPoint(node, true);
                return endStatus && endStatus.type !== Map.NodeType.PartPoint;
            }
            else {
                return false;
            }
        });

        if (roundSet.length > 0) {
            // 交集中离鼠标最近的点
            const closest = end.closest(roundSet);
            // 导线形状相似
            if (endRoundWay.isSimilar(cache.get(closest, endBias)!)) {
                way = LineWay.from(cache.get(closest, endBias)!);
                way.endToLine([endRound, closest], end);
                pointSize.$set(1, 3);
            }
            else {
                way = LineWay.from(endRoundWay);
            }
        }
        else {
            way = LineWay.from(endRoundWay);
        }
    }
    else {
        // 选取终点中节点最多的路径
        const key = ends.filter((node) => cache.has(node, endBias)).reduce(
            (pre, next) =>
                (cache.get(pre, endBias)!.length >= cache.get(next, endBias)!.length) ? pre : next,
        );

        way = LineWay.from(cache.get(key, endBias)!);
        way.endToPoint(end);
    }

    return way;
}

/** 单点绘制 - 导线搜索 */
export function search(params: Option) {
    return setWayPath(searchWay(setSearchConfig(params)));
}
