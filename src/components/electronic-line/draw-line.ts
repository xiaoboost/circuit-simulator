// import * as assert from 'src/lib/assertion';
import { $P, Point } from 'src/lib/point';
import { LineWay } from './line-way';
import { nodeSearch } from './node-search';

import { Component, Vue, Inject } from 'vue-property-decorator';
import { DrawingOption, ExchangeData } from './types';
import { FindPart, FindLine, SetDrawEvent, MapStatus } from 'src/components/drawing-main';

@Component
export default class DrawLine extends Vue {
    way: Point[] = [];
    connect: string[] = [];
    pointSize = [-1, -1];

    /** 设置图纸事件 */
    @Inject()
    protected readonly setDrawEvent: SetDrawEvent;
    /** 搜索器件 */
    @Inject()
    protected readonly findPart: FindPart;
    /** 搜索导线 */
    @Inject()
    protected readonly findLine: FindLine;
    /** 图纸相关状态 */
    @Inject()
    protected readonly mapStatus: MapStatus;

    // 导线反转
    reverse() {
        this.way.reverse();
        this.connect.reverse();
    }

    // 绘制导线
    async drawing({ start, end, direction, temp }: DrawingOption) {
        // 当前终点四方格左上角顶点
        const vertex = end.floor();
        // 当前终点四舍五入坐标
        // const endRound = end.round();
        // 四方格坐标
        const endGrid = vertex.toGrid();
        // 路径缓存
        const wayMap = temp.wayMap;

        // 待搜索的点集合
        let ends: Point[] = [];
        // 当前搜索状态
        let status = '';

        // 终点并未覆盖上器件
        if (!temp.onPart) {
            ends = endGrid;
        }
        // 终点离开器件
        else if (temp.onPart.status === 'leave') {
            const part = temp.onPart.part;

            ends = endGrid;
            this.pointSize.$set(1, 8);
            part.pointSize.$set(temp.onPart.pointIndex, -1);
        }
        // 终点在器件上，强制对齐
        else {
            const part = temp.onPart.part;
            const points = part.points.map((point) => point.position);
            const mouseToPart = $P(part.position, end.add(temp.mouseBais));
            const partToPoint = points.filter((_, i) => !part.connect[i]);

            // 允许直接对齐
            if (partToPoint.length > 0) {
                const allowPoint = mouseToPart.minAngle(partToPoint);

                // 导线终点缩小
                this.pointSize.$set(1, 2);
                // 上次器件的节点恢复默认大小
                part.pointSize.$set(temp.onPart.pointIndex, -1);

                temp.onPart.pointIndex = points.findIndex((node) => node.isEqual(allowPoint));

                // 当前器件的节点设置大小
                part.pointSize.$set(temp.onPart.pointIndex, 2);

                status = 'align';
                ends = [allowPoint.add(part.position)];
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

        const options: ExchangeData = {
            start, direction, end: $P(),
            endBias: endGrid[0].add(10),
            status: 'drawing',
        };

        for (const point of ends) {
            // 是否为空
            if (wayMap.has(point)) {
                continue;
            }

            // 设置当前搜索终点
            options.end = point;

            // 搜索导线
            const tempWay = nodeSearch(options);
            tempWay.checkWayExcess(options);

            // 搜索图中设置所有节点
            tempWay.forEachSubway((subway) => wayMap.set(subway.get(-1), subway));
        }

        temp.onPart = undefined;

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
                    (wayMap.get(pre)!.length >= wayMap.get(next)!.length)
                        ? pre : next,
            );

            way = LineWay.from(wayMap.get(key)!);
            way.endToPoint(end);
        }

        this.way = way;
    }
}
