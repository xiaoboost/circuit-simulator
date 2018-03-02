import { Point } from 'src/lib/point';
import { LineWay } from './line-way';
import { nodeSearch } from './node-search';

import { DrawingOption } from './types';
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
            // FIXME: 并不是全程都能扩展的
            // 由缓存中扩展四顶点路径
            wayMap.expend(endGrid);

            // 搜索四顶点路径
            endGrid
                .filter((node) => !wayMap.has(node))
                .forEach((node) => {
                    const tempWay = nodeSearch({
                        start, direction,
                        end: node,
                        endBias: endGrid[0].add(10),
                        status: 'drawing',
                    });

                    tempWay.checkWayExcess();
                    wayMap.set(node, tempWay);
                });
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
