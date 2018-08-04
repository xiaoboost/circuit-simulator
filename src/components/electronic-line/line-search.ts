import Point, { $P } from 'src/lib/point';

import { LineWay, WayMap } from './line-way';
import { SearchOption, nodeSearch } from './node-search';
import PartComponent from 'src/components/electronic-part/component';

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
    /** 鼠标覆盖器件状态 */
    onPart: {
        status: 'idle';
    } | {
        status: 'over' | 'leave';
        part: PartComponent;
        pointIndex: number;
    };
}

export function drawingSearch({ start, end, direction, mouseBais, wayMap, pointSize, onPart }: DrawingOption) {
    // 当前终点四方格左上角顶点
    const vertex = end.floor();
    // 当前终点四舍五入坐标
    const endRound = end.round();
    // 四方格坐标
    const endGrid = vertex.toGrid();

    // 待搜索的点集合
    let ends: Point[] = [];
    // 搜索状态
    let status = '';

    /** 终点状态判断 */
    // 终点闲置
    if (onPart.status === 'idle') {
        ends = endGrid;
    }
    // 终点离开器件
    else if (onPart.status === 'leave') {
        ends = endGrid;
        pointSize.$set(1, 8);
        onPart.part.pointSize.$set(onPart.pointIndex, -1);
    }
    // 终点在器件上，强制对齐
    else {
        const points = onPart.part.points.map((point) => point.position);
        const mouseToPart = new Point(onPart.part.position, end.add(mouseBais));
        const idlePoint = points.filter((_, i) => !onPart.part.connect[i]);

        // 允许直接对齐
        if (idlePoint.length > 0) {
            const allowPoint = mouseToPart.minAngle(idlePoint);

            // 导线终点缩小
            pointSize.$set(1, 2);

            /**
             * 在同一个器件的不同引脚切换
             * 所以需要将之前的引脚复位，然后再给新的引脚设置大小
             */
            onPart.part.pointSize.$set(onPart.pointIndex, -1);
            onPart.pointIndex = points.findIndex((node) => node.isEqual(allowPoint));
            onPart.part.pointSize.$set(onPart.pointIndex, 2);

            status = 'align';
            ends = [allowPoint.add(onPart.part.position)];
        }
        else {
            ends = endGrid;
        }
    }

    // 按照距离起点由远到近的顺序排序
    ends = ends.sort(
        (pre, next) =>
            pre.distance(next) > next.distance(start) ? -1 : 1,
    );

    // 节点搜索选项
    const option: SearchOption = {
        start,
        direction,
        end: $P(0, 0),
        status: 'drawing',
        endBias: endGrid[0].add(10),
    };

    // 搜索路径
    for (const point of ends) {
        if (wayMap.has(point)) {
            continue;
        }

        // 设置当前搜索终点
        option.end = point;

        // 搜索导线
        const tempWay = nodeSearch(option);
        tempWay.checkWayExcess(option);

        // 记录当前搜索结果
        wayMap.set(point, tempWay);
    }

    onPart.status = 'idle';

    let way: LineWay;

    // 强制对齐模式
    if (status === 'align') {
        way = LineWay.from(wayMap.get(ends[0])!);
    }
    // 普通模式
    else {
        // 选取四顶点中节点最多的路径
        const key = endGrid.reduce(
            (pre, next) =>
                (wayMap.get(pre)!.length >= wayMap.get(next)!.length) ? pre : next,
        );

        way = LineWay.from(wayMap.get(key)!);
        way.endToPoint(end);
    }

    return way;
}
