import { $P, Point } from 'src/lib/point';
import { LineWay } from './line-way';
import { nodeSearch } from './node-search';

import { DrawingOption, ExchangeData } from './types';
import { Component, Vue, Inject } from 'vue-property-decorator';
import { FindPart, FindLine, SetDrawEvent, MapStatus } from 'src/components/drawing-main';

@Component
export default class DrawLine extends Vue {
    way: Point[] = [];
    connect: string[] = [];
    pointSize: number[] = [-1, -1];

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

        // 顶点坐标变化
        if (!temp.lastVertex.isEqual(vertex)) {
            // 记录当前顶点坐标
            temp.lastVertex = vertex;
            // 按照距离起点由远到近的顺序排序
            const sort = endGrid.sort(
                (pre, next) =>
                    pre.distance(next) > next.distance(start) ? -1 : 1,
            );

            const options: ExchangeData = {
                start, direction, end: $P(),
                endBias: endGrid[0].add(10),
                status: 'drawing',
            };

            for (const point of sort) {
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
        }

        // 选取四顶点中节点最多的路径
        const key = endGrid.reduce(
            (pre, next) =>
                (wayMap.get(pre)!.length >= wayMap.get(next)!.length)
                    ? pre : next,
        );

        const way = LineWay.from(wayMap.get(key)!);
        way.endToPoint(end);

        this.way = way;
    }
}
