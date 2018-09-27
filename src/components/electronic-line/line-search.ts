import Point from 'src/lib/point';

import { LineWay, WayMap } from './line-way';
import { SearchOption, nodeSearch } from './node-search';

import LineComponent from './component';
import PartComponent from '../electronic-part/component';

export interface DrawingOption {
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
        status: 'idle';
        recover?(): void;
    } | {
        status: 'part';
        part: PartComponent;
        recover?(): void;
    } | {
        status: 'line';
        line: LineComponent;
    };
}

/** 计算单点绘制时的状态与终点 */
function getDrawingStatus({ start, end, mouseBais, pointSize, mouseOver }: DrawingOption) {
    // 当前终点四方格左上角顶点
    const vertex = end.floor();
    // 四方格坐标
    const endGrid = vertex.toGrid();

    let status = 'normal', ends: Point[] = [];

    pointSize.$set(1, 8);

    // 终点在器件上
    if (mouseOver.status === 'part') {
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
            status = 'align-point';
            // 终点只有需要对齐的点
            ends = [allowPoint.add(mouseOver.part.position)];
        }
        // 不允许直接对齐
        else {
            ends = endGrid;
        }
    }
    // 终点在导线上
    else if (mouseOver.status === 'line') {
        // ..
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

export function drawingSearch({ start, end, direction, wayMap, pointSize }: DrawingOption) {
    // 当前终点四方格左上角顶点
    const vertex = end.floor();

    // 计算当前终点以及状态
    const { ends, status } = getDrawingStatus(arguments[0]);
    // 节点搜索选项
    const option: SearchOption = {
        start,
        direction,
        end: new Point(0, 0),
        status: 'drawing',
        endBias: vertex.add(10),
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

    // 强制对齐模式
    if (status === 'align-point') {
        way = LineWay.from(wayMap.get(ends[0])!);
    }
    // 普通模式
    else {
        // 选取四顶点中节点最多的路径
        const key = vertex.toGrid().filter((node) => wayMap.has(node)).reduce(
            (pre, next) =>
                (wayMap.get(pre)!.length >= wayMap.get(next)!.length) ? pre : next,
        );

        way = LineWay.from(wayMap.get(key)!);
        way.endToPoint(end);
    }

    return way;
}
