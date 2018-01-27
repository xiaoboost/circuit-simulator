import Search from 'worker-loader!./node-search';

import { Point } from 'src/lib/point';
import { LineWay } from './line-way'; // WayMap
import ProcessManager from 'src/lib/process';

import { ExchangeData, DrawingOption } from './types';

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

export async function drawSearch({ start, end, direction, map, temp }: DrawingOption) {
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

    const way = new LineWay(wayMap.get(key)!);
    way.endToPoint(end);

    return way;
}
