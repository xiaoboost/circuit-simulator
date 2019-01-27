import Point from 'src/lib/point';

import * as map from 'src/lib/map';
import { LineWay, WayMap } from './line-way';
import { NodeSearchOption, nodeSearch } from './node-search';

import LineComponent from './component';
import PartComponent from '../electronic-part/component';

/** 绘制阶段的相关接口和常量 */
export namespace DarwSearch {
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
            status: MouseStatus.Idle;
            recover?(): void;
        } | {
            status: MouseStatus.Part;
            part: PartComponent;
            recover?(): void;
        } | {
            status: MouseStatus.Line;
            line: LineComponent;
        };
    }
    /** 鼠标指向的状态 */
    export const enum MouseStatus {
        /** 鼠标指向为控 */
        Idle,
        /** 鼠标指向器件 */
        Part,
        /** 鼠标指向导线 */
        Line,
    }
}

/** 移动端点阶段的相关接口和常量 */
export namespace MoveSearch {
    // ..
}

/** 导线变形阶段的相关接口和常量 */
export namespace DeformSearch {
    // ..
}

/** 搜索状态列表 */
export const enum SearchStatus {
    /** 普通状态 */
    DrawSpace,
    /** 对齐引脚 */
    DrawAlignPoint,
    /** 对齐导线 */
    DrawAlignLine,
}

/**
 * 绘制模式 ---|
 * 移动端点 ---|--- nodeSearch 点对点搜索
 * 以懂线段 ---|
 *
 * nodeSearch 起点、终点、初始方向、终点偏移量、状态（将会决定搜索规则）
 * 那么，所有的状态都是公共的
 */

/** 计算单点绘制时的状态与终点 */
function getDrawingStatus({ start, end, mouseBais, pointSize, mouseOver }: DarwSearch.Option) {
    // 当前终点四方格左上角顶点
    const vertex = end.floor();
    // 四方格坐标
    const endGrid = vertex.toGrid();

    let ends: Point[] = [];
    let status = SearchStatus.DrawSpace;

    pointSize.$set(1, 8);

    // 终点在器件上
    if (mouseOver.status === DarwSearch.MouseStatus.Part) {
        const points = mouseOver.part.points.map((point) => point.position);
        const mouseToPart = new Point(mouseOver.part.position, end.add(mouseBais));
        const idlePoint = points.filter((_, i) => !mouseOver.part.connect[i]);

        if (mouseOver.recover) {
            mouseOver.recover();
            mouseOver.recover = undefined;
        }

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
            status = SearchStatus.DrawAlignPoint;
            // 终点只有需要对齐的点
            ends = [allowPoint.add(mouseOver.part.position)];
        }
        // 不允许直接对齐
        else {
            ends = endGrid;
        }
    }
    // 终点在导线上
    else if (mouseOver.status === DarwSearch.MouseStatus.Line) {
        const mouseRound = end.round();
        const mouseStatus = map.getPoint(mouseRound, true)!;

        if (mouseStatus.type === 'line-cross-point') {
            status = SearchStatus.DrawAlignPoint;
            ends = [mouseRound];
        }
        else {
            status = SearchStatus.DrawAlignLine;
            ends = endGrid.filter((node) => map.isLine(node, true));
        }
    }
    // 终点闲置
    else {
        ends = endGrid;

        if (mouseOver.recover) {
            mouseOver.recover();
            mouseOver.recover = undefined;
        }
    }

    // 按照距离起点由远到近的顺序排序
    if (ends.length > 1) {
        ends = ends.sort(
            (pre, next) =>
                pre.distance(start) > next.distance(start) ? -1 : 1,
        );
    }

    return { status, ends };
}

export function drawingSearch({ start, end, direction, wayMap, pointSize }: DarwSearch.Option) {
    // 计算当前终点以及状态
    const { ends, status } = getDrawingStatus(arguments[0]);
    // 节点搜索选项
    const option: NodeSearchOption = {
        start,
        direction,
        end: new Point(0, 0),
        status: SearchStatus.DrawSpace,
        endBias: end.floor().add(10),
    };

    // 搜索路径
    for (const point of ends) {
        if (wayMap.has(point)) {
            continue;
        }

        // 设置当前搜索终点
        option.end = point;

        // 搜索导线
        const tempWay = nodeSearch(option).checkWayExcess(option);

        // 记录当前搜索结果
        wayMap.set(point, tempWay);
    }

    let way: LineWay;

    if (status === SearchStatus.DrawAlignPoint) {
        way = LineWay.from(wayMap.get(ends[0])!);
    }
    else if (status === SearchStatus.DrawAlignLine) {
        debugger;
        const endRound = end.round();
        const endRoundWay = wayMap.get(endRound)!;
        // 与<终点四舍五入的点>相连的坐标集合与四方格坐标集合的交集
        const roundSet = ends.filter((node) => {
            if (map.hasConnect(endRound, node, true)) {
                const endStatus = map.getPoint(node, true);
                return endStatus && endStatus.type !== 'part-point';
            }
            else {
                return false;
            }
        });

        if (roundSet.length > 0) {
            // // 交集中离鼠标最近的点
            // const closest = end.closest(roundSet);
            // // 导线最后两个节点不同
            // if (endRoundWay.isSimilar(wayMap.get(closest))) {
            //     this.shrinkCircle(1);
            //     this.way.clone(mouseRoundWay);closest
            //     this.way.endToLine([mouseRound, closest], mousePosition);

            //     pointSize.$set(1, 1);
            //     way = LineWay.from(wayMap.get(closest)!);
            //     way.endToLine();
            // }
            // else {
            //     way = LineWay.from(endRoundWay);
            // }

            way = LineWay.from(endRoundWay);
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
