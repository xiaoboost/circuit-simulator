import { Point, type PathWithPoint } from '@circuit/algorithm';
import { getPartPins, getIndexVector } from '@circuit/electronics';
import { isDef } from '@xiao-ai/utils';
import {
  PathSearcher,
  SearchResult,
  SearchMode,
  aStarSearch,
  createRules,
  removeRepeat,
  endToPoint,
  endToLine,
  isSimilar,
} from '../algorithm';
import {
  EntityKind,
  PIN_DRAW_EXPANDED_STYLE,
  PIN_DRAW_FIXED_STYLE,
} from '../constant';
import { DrawLineSearcherOptions } from './types';

export function createDrawLineSearcher({
  start,
  direction,
  lineId,
  painter,
  hook,
}: DrawLineSearcherOptions): PathSearcher {
  /** 搜索缓存 */
  const cache = new Map<string, PathWithPoint>();
  /** 搜索终点列表 */
  let endList: Point[] = [];
  /** 搜索模式 */
  let searchMode: SearchMode;
  /** 优先出线方向 */
  let preferDirection: Point;
  /** 搜索结果 */
  let result: SearchResult[] = [];

  /** 获取搜索状态 */
  function getSearchStatus(end: Point, endBias: Point) {
    /** 终点所在方块左上角坐标 */
    const origin = end.floor();
    /** 四方格坐标 */
    const endGrid = origin.toGrid();
    /** 四方格中心坐标 */
    const endCenter = origin.add(10);
    /** 至四方格中心坐标的偏移量 */
    const directionBias = endCenter.add(start, -1).sign().add(direction);
    /** 当前鼠标悬停状态 */
    const hover = painter.getHover();

    // 初始化上下文
    result = [];
    endList = [];
    searchMode = SearchMode.DrawNormal;
    preferDirection = Math.abs(directionBias[0]) > Math.abs(directionBias[1])
      ? new Point(directionBias[0], 0).sign()
      : new Point(0, directionBias[1]).sign();

    // 终点在空白
    if (!hover) {
      endList = endGrid.filter((node) => !painter.get(node));

      // 四个节点均被占用
      if (endList.length === 0) {
        // 终点在起点的四方格内，返回起点即可
        if (endGrid.some((node) => node.isEqual(start))) {
          result.push({ id: lineId, path: [start] });
          return;
        }
        else {
          // 有导线的时候，搜索这几个导线
          // 全都被器件占据，则搜索最近的可行点
          throw new Error('FIXME: 终点四方格全被占用，无法计算路径');
        }
      }

      // 导线节点半径最大
      result.push({ id: lineId, pin: 1, style: PIN_DRAW_EXPANDED_STYLE });
    }
    // 终点在导线
    else if (hover.kind === EntityKind.Line || hover.kind === EntityKind.LinePin) {
      // 四方格上在导线上的点
      endList = endGrid.filter((node) => painter.isLineAndLine(painter.get(node)));
      // 线对齐模式
      searchMode = SearchMode.DrawAlignLine;
      // 导线节点半径缩小
      result.push({ id: lineId, pin: 1, style: PIN_DRAW_FIXED_STYLE });
    }
    // 终点在器件
    else if (hover.kind === EntityKind.Part || hover.kind === EntityKind.PartPin) {
      const part = painter.getPart(hover.id);

      if (!part) {
        throw new Error('无法获取元件数据');
      }

      const pins = getPartPins(part).map((pin) => pin.origin);
      const mouseToPart = new Point(part.position, end.add(endBias));
      const idlePoint = pins.filter((_, i) => {
        return painter.getConnection(part.id, i).length === 0;
      });

      // 有空引脚，允许直接对齐
      if (idlePoint.length > 0) {
        const allowPoint = mouseToPart.minAngle(idlePoint);

        // 点对齐状态
        searchMode = SearchMode.DrawAlignPoint;
        // 终点只有需要对齐的点
        endList = [part.position.add(allowPoint)];

        // 对齐的终点等于起点，导线节点半径放大
        if (endList[0].isEqual(start)) {
          result.push({ id: lineId, pin: 1, style: PIN_DRAW_EXPANDED_STYLE });
        }
        // 对齐其他节点时，导线节点半径缩小
        else {
          result.push({ id: lineId, pin: 1, style: PIN_DRAW_FIXED_STYLE });
        }
      }
      else {
        // TODO: 没有空引脚，应该按照空白模式继续
        searchMode = SearchMode.DrawNormal;
      }
    }
    else {
      throw new Error(`意外情况，无法计算路径，当前 Hover 状态：${JSON.stringify(hover)}`);
    }

    // 按照到起点的距离，由大到小排序
    if (endList.length > 1) {
      endList = endList.sort(
        (pre, next) =>
          pre.distance(start) > next.distance(start) ? -1 : 1,
      );
    }
  }

  /** 二次搜索 */
  function secondSearch(path: PathWithPoint): PathWithPoint {
    const newPath = path.slice();

    if (newPath.length <= 3) {
      return newPath;
    }

    // 如果初始方向和第二个线段方向相同，说明此处需要修正
    if (preferDirection.isSameDirection(getIndexVector(newPath, 1))) {
      const start = newPath[0];
      const end = newPath[2];
      const temp = aStarSearch({
        start,
        end,
        hook,
        direction: preferDirection,
        rules: createRules({
          start,
          end,
          painter,
          mode: SearchMode.DrawAlignPoint,
          direction: preferDirection,
        }),
      });

      newPath.splice(0, 3, ...temp);
      removeRepeat(newPath);
    }

    for (let i = 0; i < newPath.length - 3; i++) {
      const vector = [
        (new Point(newPath[i], newPath[i + 1])).toUnit(),
        (new Point(newPath[i + 2], newPath[i + 3])).toUnit(),
      ];

      // 同向修饰
      if (vector[0].isEqual(vector[1])) {
        const start = newPath[i + 1];
        const end = newPath[i + 3];
        const direction = vector[0];
        const tempWay = aStarSearch({
          start,
          end,
          hook,
          direction,
          rules: createRules({
            start,
            end,
            painter,
            mode: SearchMode.DrawAlignPoint,
            direction,
          }),
        });

        if (tempWay.length < 4 && getIndexVector(tempWay, 0).isSameDirection(vector[0])) {
          newPath.splice(i + 1, 3, ...tempWay);
          removeRepeat(newPath);
          i--;
        }
      }
      // 反向修饰
      else if (newPath.length > 4) {
        const start = newPath[i];
        const end = newPath[i + 3];
        const direction = vector[0];
        const tempWay = aStarSearch({
          start,
          end,
          hook,
          direction,
          rules: createRules({
            start,
            end,
            painter,
            mode: SearchMode.DrawAlignPoint,
            direction,
          }),
        });

        if (tempWay.length < 4) {
          newPath.splice(i, 4, ...tempWay);
          removeRepeat(newPath);
          i--;
        }
      }
    }

    return removeRepeat(newPath);
  }

  /** 搜索路径 */
  function getSearchPath() {
    for (const end of endList) {
      const key = end.join(',');

      if (cache.has(key)) {
        continue;
      }

      const tempWay = secondSearch(aStarSearch({
        start,
        end,
        hook,
        direction: preferDirection,
        rules: createRules({
          start,
          end,
          painter,
          mode: searchMode,
          direction: preferDirection,
        }),
      }));

      cache.set(key, tempWay);
    }
  }

  /** 修饰路径 */
  function modifyPath(end: Point) {
    // 点对齐的情况下，直接获取缓存
    if (searchMode === SearchMode.DrawAlignPoint) {
      result.push({
        id: lineId,
        path: cache.get(endList[0].join(','))!,
      });
    }
    // 对齐导线的情况下，修饰导线
    else if (searchMode === SearchMode.DrawAlignLine) {
      const endRound = end.round();
      const endMark = painter.get(endRound)!;
      const endRoundWay = cache.get(endRound.join(','))!;
      // 与<终点四舍五入的点>相连的坐标集合与四方格坐标集合的交集
      const roundSet = endList.filter((node) => {
        if (painter.isLineAndPoint(endMark)) {
          return painter.hasConnect(endMark, node)
            ? painter.isPartPinLine(painter.get(node))
            : false;
        }
        else {
          return false;
        }
      });

      if (roundSet.length > 0) {
        /** 交集中离鼠标最近的点 */
        const closest = end.closest(roundSet);
        const similarPath = cache.get(closest.join(','));
        // 导线形状相似
        if (similarPath && isSimilar(endRoundWay, similarPath)) {
          result.push({
            id: lineId,
            path: endToLine(endRoundWay, [endRound, closest], end),
          });

          result.push({
            id: lineId,
            pin: 1,
            style: PIN_DRAW_EXPANDED_STYLE,
          });
        }
        else {
          result.push({
            id: lineId,
            path: endToPoint(endRoundWay, end),
          });
        }
      }
      else {
        result.push({
          id: lineId,
          path: endToPoint(endRoundWay, end),
        });
      }
    }
    // 普通终点
    else {
      // 选取终点中节点最多的路径
      const newPath = endList
        .map((node) => cache.get(node.join(',')))
        .filter(isDef)
        .reduce(
          (pre, next) => pre.length >= next.length ? pre : next,
        )
        .slice();

      // 指向终点
      result.push({
        id: lineId,
        path: endToPoint(newPath, end),
      });
    }
  }

  const CreateLineSearch: PathSearcher = (end, endBias = Point.from([0, 0])): SearchResult[] => {
    getSearchStatus(end, endBias);
    getSearchPath();
    modifyPath(end);

    return result.slice();
  };

  CreateLineSearch.getSearchPath = () => result.find((result) => 'path' in result)?.path ?? [];

  return CreateLineSearch;
}
