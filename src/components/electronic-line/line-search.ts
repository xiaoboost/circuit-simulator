import Point from 'src/lib/point';

import * as Map from 'src/lib/map';
import { LineWay, WayMap } from './line-way';
import { NodeSearchOption, nodeSearch } from './node-search';

import LineComponent from '.';
import PartComponent from '../electronic-part';

/** 绘制阶段的相关接口和常量 */
export namespace DrawSearch {
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
        wayMap: WayMap;
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
}

/** 移动端点阶段的相关接口和常量 */
export namespace MoveSearch {
    /** 搜索状态 */
    export const enum Status {
        /** 普通状态 */
        Space = 20,
    }
}

/** 导线变形阶段的相关接口和常量 */
export namespace DeformSearch {
    /** 搜索状态 */
    export const enum Status {
        /** 普通状态 */
        Space = 30,
    }
}

/** 所有搜索状态 */
export type SearchStatus = DrawSearch.Status | MoveSearch.Status | DeformSearch.Status;

/** 单点绘制 - 导线搜索 */
export function drawSearch({ start, end, direction, wayMap, pointSize, mouseOver, mouseBais }: DrawSearch.Option) {
    // 当前终点四方格左上角顶点
    const vertex = end.floor();
    // 四方格坐标
    const endGrid = vertex.toGrid();

    let ends: Point[] = [];
    let status = DrawSearch.Status.Space;

    // 导线终点默认最大半径
    pointSize.$set(1, 8);

    // 引脚复位
    if (mouseOver.recover) {
        mouseOver.recover();
        mouseOver.recover = undefined;
    }

    // 终点在器件上
    if (mouseOver.status === DrawSearch.Mouse.Part) {
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
            status = DrawSearch.Status.AlignPoint;
            // 终点只有需要对齐的点
            ends = [allowPoint.add(mouseOver.part.position)];
        }
        // 不允许直接对齐
        else {
            ends = endGrid;
        }
    }
    // 终点在导线上
    else if (mouseOver.status === DrawSearch.Mouse.Line) {
        const mouseRound = end.round();
        const mouseStatus = Map.getPoint(mouseRound, true)!;

        // 导线交错节点或者是空闲节点，则直接对齐
        if (
            mouseStatus.type === Map.NodeType.LinePoint ||
            mouseStatus.type === Map.NodeType.LineCrossPoint
        ) {
            status = DrawSearch.Status.AlignPoint;
            ends = [mouseRound];
        }
        // 否则选取四方格中在导线上的点
        else {
            status = DrawSearch.Status.AlignLine;
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
        if (wayMap.has(point)) {
            continue;
        }

        // 设置当前搜索终点
        option.end = point;

        // 搜索并修饰
        const tempWay = nodeSearch(option).checkWayExcess({
            ...option,
            status: DrawSearch.Status.Modification,
        });

        // 记录当前搜索结果
        wayMap.set(point, tempWay);
    }

    let way: LineWay;

    if (status === DrawSearch.Status.AlignPoint) {
        way = LineWay.from(wayMap.get(ends[0])!);
    }
    else if (status === DrawSearch.Status.AlignLine) {
        const endRound = end.round();
        const endRoundWay = wayMap.get(endRound)!;
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
            if (endRoundWay.isSimilar(wayMap.get(closest)!)) {
                way = LineWay.from(wayMap.get(closest)!);
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
        const key = ends.filter((node) => wayMap.has(node)).reduce(
            (pre, next) =>
                (wayMap.get(pre)!.length >= wayMap.get(next)!.length) ? pre : next,
        );

        way = LineWay.from(wayMap.get(key)!);
        way.endToPoint(end);
    }

    return way;
}
