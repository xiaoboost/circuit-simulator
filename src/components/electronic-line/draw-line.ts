import Search from 'worker-loader!./node-search';

import { Point } from 'src/lib/point';
import { LineWay } from './line-way'; // WayMap
import ProcessManager from 'src/lib/process';

import { Component, Vue, Inject } from 'vue-property-decorator';

import {
    ExchangeData,
    DrawingOption,
} from './types';

import {
    FindPart,
    FindLine,
    SetDrawEvent,
    MapStatus,
} from 'src/components/drawing-main';

// 导线搜索进程管理器
const Manager = new ProcessManager(Search);

async function nodeSearch(option: ExchangeData): Promise<LineWay> {
    const search = await Manager.getIdleProcess();
    const result = await search.post<Point[]>(option);
    return (new LineWay(result));
}

@Component
export default class DrawLine extends Vue {
    way: LineWay = new LineWay();
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
    async drawing({ start, end, direction, map, temp }: DrawingOption) {
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
            // 由缓存中扩展四顶点路径
            wayMap.expend(endGrid);
            debugger;
            // 搜索四顶点路径
            await Promise.all(
                endGrid
                    .filter((node) => !wayMap.has(node))
                    .map(async (node) => wayMap.set(node, await nodeSearch({
                        start, direction, map,
                        end: node,
                        endBias: endGrid[0].add(10),
                        status: 'drawing',
                    }))),
            );
        }

        // 选取四顶点中节点最多的路径
        const key = endGrid.reduce(
            (pre, next) =>
                (wayMap.get(pre)!.length >= wayMap.get(next)!.length)
                    ? pre : next,
        );

        this.way = new LineWay(wayMap.get(key)!);
        // this.way.endToPoint(end);
    }
}
