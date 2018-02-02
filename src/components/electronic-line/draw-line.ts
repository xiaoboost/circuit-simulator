import Search from 'worker-loader!./node-search';

import { Point } from 'src/lib/point';
import { LineWay } from './line-way'; // WayMap
import ProcessManager from 'src/lib/process';

import { Component, Vue, Inject } from 'vue-property-decorator';

import {
    LineData,
    ExchangeData,
    DrawingOption,
} from './types';

import {
    FindPart,
    FindLine,
    SetDrawEvent,
    DrawEvent,
    MapStatus,
} from 'src/components/drawing-main';

// 格式化返回的数据
function process2Data(data: string): LineWay {
    const points = JSON.parse(data) as Point[];
    return new LineWay(points);
}

// 导线搜索进程管理器
const Manager = new ProcessManager(Search);

async function nodeSearch(option: ExchangeData): Promise<LineWay> {
    const search = await Manager.getIdleProcess();
    const result = await search.post<string>(option);
    return process2Data(result);
}

@Component
export default class DrawLine extends Vue {
    way: LineWay = new LineWay();
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

    /** 路径转为 path 字符串 */
    private get way2path() {
        return !this.way.length ? ''　: 'M' + this.way.map((n) => n.join(',')).join('L');
    }
    /** 路径转为 rect 坐标 */
    private get pathRects() {
        const ans = [], wide = 14;

        for (let i = 0; i < this.way.length - 1; i++) {
            const start = this.way[i], end = this.way[i + 1];
            const left = Math.min(start[0], end[0]);
            const top = Math.min(start[1], end[1]);
            const right = Math.max(start[0], end[0]);
            const bottom = Math.max(start[1], end[1]);

            ans.push({
                x: left - wide / 2,
                y: top - wide / 2,
                height: (left === right) ? bottom - top + wide　: wide,
                width: (left === right) ? wide : right - left + wide,
            });
        }

        return ans;
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
            // 搜索四顶点路径
            await Promise.all(
                endGrid
                    .filter((node) => !wayMap.has(node))
                    .map(async (node) => wayMap.set(node, await nodeSearch({
                        start, end, direction, map,
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
        this.way.endToPoint(end);
    }
    // 导线反转
    reverse() {
        this.way.reverse();
        this.connect.reverse();
    }
}
