import { Point, PathWithPoint } from '@circuit/algorithm';
import { PathSearcher, SearchResult, SearchMode } from '../algorithm';
import { Entity, EntityKind } from '../constant';
import { DrawLineSearcherOptions } from './types';

export function createDrawLineSearcher({
  start,
  startPart,
  direction,
  lineId,
  map,
  painter,
  hook,
}: DrawLineSearcherOptions): PathSearcher {
  /** 搜索缓存 */
  const cache = new Map<string, PathWithPoint>();
  /** 上次鼠标悬停状态 */
  let lastHover: Entity | undefined;

  return (end, endBias = Point.from([0, 0])): SearchResult[] => {
    /** 搜索结果 */
    const result: SearchResult[] = [];
    /** 终点所在方块左上角坐标 */
    const vertex = end.floor();
    /** 四方格坐标 */
    const endGrid = vertex.toGrid();
    /** 四方格中心坐标 */
    const endCenter = vertex.add(10);
    /** 至四方格中心坐标的偏移量 */
    const directionBias = endCenter.add(start, -1).sign().add(direction);
    /** 优先出线方向 */
    const preferDirection = Math.abs(directionBias[0]) > Math.abs(directionBias[1])
      ? new Point(directionBias[0], 0).sign()
      : new Point(0, directionBias[1]).sign();
    /** 当前鼠标悬停状态 */
    const hover = painter.getHover();

    // 导线空节点半径默认最大
    result.push({ id: lineId, pin: 1, size: 8 });
    // 引脚复位


    /** 搜索终点列表 */
    let endList: Point[] = [];
    /** 搜索模式 */
    let searchMode = SearchMode.DrawNormal;

    /**
     * 终点在空白
     *   
     *   四方格和起点曼哈顿距离相差小于等于2，此时需要排除终点四方格的器件标记
     *   否则，直接搜索终点四方格
     *
     * 终点在导线、导线节点
     *   终点等效为导线
     *
     * 终点在器件、器件引脚
     *   是否有空的器件引脚
     *     有，则挑一个离鼠标最近的对齐
     *     无，则按照器件边框，搜索最近的可用点，使用这个点作为终点重新收缩
     */

    // 终点在空白
    if (!hover) {
      endList = endGrid;
      searchMode = SearchMode.DrawNormal;
      // if (lastHover) {
      //   result.push({ id: lastHover.id, pin: 1, size: undefined });
      // }
    }
    // 终点在导线
    else if (hover.kind === EntityKind.Line) {

    }
    // 终点在器件
    else if (hover.kind === EntityKind.Part) {

    }
    // this.line.points[1].size = 8;
    // 引脚复位

    return result;
  };
}
