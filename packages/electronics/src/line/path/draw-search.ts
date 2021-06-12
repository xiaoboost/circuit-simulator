import { Point } from '@circuit/math';
import { LinePath } from './line-path';
import { pointSearch } from './point-search';
import { Cache } from './cache';
import { Rules } from './search-rules';
import { SearchStatus } from './constant';
import { ElectronicKind } from '../../types';

import type { Line } from '../';
import type { Part } from '../../part';

export class DrawPathSearcher {
  /** 起点 */
  readonly start: Point;
  /** 起始方向 */
  readonly direction: Point;
  /** 当前导线 */
  readonly line: Line;

  /** 鼠标的覆盖的状态 */
  private mouseOver?: Part | Line;
  /** 释放鼠标覆盖状态 */
  private mouseOverRecover?: () => void;
  /** 搜索缓存 */
  private cache = new Cache<Point>((point) => {
    return point.join(',');
  });

  /** 搜索状态 */
  private status = SearchStatus.DrawSpace;
  /** 待搜索的终点列表 */
  private endList: Point[] = [];

  constructor(start: Point, direction: Point, line: Line) {
    this.start = start;
    this.direction = direction;
    this.line = line;
  }

  private getSearchStatus(end: Point, bias: Point) {
    /** 终点所在方块左上角坐标 */
    const vertex = end.floor();
    /** 四方格坐标 */
    const endGrid = vertex.toGrid();

    // debugger;

    // 导线终点默认最大半径
    this.line.points[1].size = 8;

    // 引脚复位
    // if (mouseOver.recover) {
    //   mouseOver.recover();
    //   mouseOver.recover = undefined;
    // }

    // 终点在空白
    if (!this.mouseOver) {
      this.endList = endGrid;
    }
    // 终点在导线
    else if (this.mouseOver.kind === ElectronicKind.Line) {
      // const mouseRound = end.round();
      // const mouseStatus = map.get(mouseRound)!;

      // // 导线交错节点或者是空闲节点，则直接对齐
      // if (
      //   mouseStatus.type === map.NodeType.LinePoint ||
      //   mouseStatus.type === map.NodeType.LineCrossPoint
      // ) {
      //   status = Status.AlignPoint;
      //   ends = [mouseRound];
      // }
      // // 否则选取四方格中在导线上的点
      // else {
      //   status = Status.AlignLine;
      //   ends = endGrid.filter((node) => map.isLine(node, true));
      // }
    }
    // 终点在器件
    else {
      // const points = mouseOver.part.points.map((point) => point.position);
      // const mouseToPart = new Point(mouseOver.part.position, end.add(mouseBias));
      // const idlePoint = points.filter((_, i) => !mouseOver.part.connect[i]);

      // // 允许直接对齐
      // if (idlePoint.length > 0) {
      //   // 导线终点缩小
      //   pointSize.$set(1, 2);

      //   // 优先对齐的引脚
      //   const allowPoint = mouseToPart.minAngle(idlePoint);
      //   const index = points.findIndex((node) => node.isEqual(allowPoint));

      //   // 该引脚缩放
      //   mouseOver.part.pointSize.$set(index, 2);
      //   // 缩放状态复位函数
      //   mouseOver.recover = () => mouseOver.part.pointSize.$set(index, -1);

      //   // 点对齐状态
      //   status = Status.AlignPoint;
      //   // 终点只有需要对齐的点
      //   ends = [allowPoint.add(mouseOver.part.position)];
      // }
      // // 不允许直接对齐
      // else {
      //   ends = endGrid;
      // }
    }

    // 按照到起点的距离，由大到小排序
    if (this.endList.length > 1) {
      this.endList = this.endList.sort(
        (pre, next) =>
          pre.distance(this.start) > next.distance(this.start) ? -1 : 1,
      );
    }
  }

  private getSearchPath() {
    const { cache, line, endList, start, status, direction } = this;

    for (const end of endList) {
      if (cache.has(end)) {
        continue;
      }

      const tempWay = this.removeExcess(pointSearch(
        start,
        end,
        direction,
        new Rules(start, end, status, line.map),
      ));

      cache.set(end, tempWay);
    }
  }

  private getLinePath(end: Point) {
    const { cache, endList } = this;

    let path = new LinePath();

    // if (status === Status.AlignPoint) {
    //   way = LinePath.from(cache.get(ends[0], endBias)!);
    // }
    // else if (status === Status.AlignLine) {
    //   const endRound = end.round();
    //   const endRoundWay = cache.get(endRound, endBias)!;
    //   // 与<终点四舍五入的点>相连的坐标集合与四方格坐标集合的交集
    //   const roundSet = ends.filter((node) => {
    //     if (map.hasConnect(endRound, node, true)) {
    //       const endStatus = map.getPoint(node, true);
    //       return endStatus && endStatus.type !== map.NodeType.PartPoint;
    //     }
    //     else {
    //       return false;
    //     }
    //   });

    //   if (roundSet.length > 0) {
    //     // 交集中离鼠标最近的点
    //     const closest = end.closest(roundSet);
    //     // 导线形状相似
    //     if (endRoundWay.isSimilar(cache.get(closest, endBias)!)) {
    //       way = LinePath.from(cache.get(closest, endBias)!);
    //       way.endToLine([endRound, closest], end);
    //       // pointSize.$set(1, 3);
    //     }
    //     else {
    //       way = LinePath.from(endRoundWay);
    //     }
    //   }
    //   else {
    //     way = LinePath.from(endRoundWay);
    //   }
    // }
    // else {
    // 选取终点中节点最多的路径
    const key = endList.filter((node) => cache.has(node)).reduce(
      (pre, next) =>
        (cache.get(pre)!.length >= cache.get(next)!.length) ? pre : next,
    );

    path = LinePath.from(cache.get(key)!);
    path.endToPoint(end);
    // }

    return path;
  }

  private removeExcess(path: LinePath) {
    const newPath = LinePath.from(path);

    if (newPath.length <= 3) {
      return newPath;
    }

    for (let i = 0; i < newPath.length - 3; i++) {
      const vector = [
        (new Point(newPath[i], newPath[i + 1])).toUnit(),
        (new Point(newPath[i + 2], newPath[i + 3])).toUnit(),
      ];

      let tempWay, tempVector;

      // 同向修饰
      if (vector[0].isEqual(vector[1])) {
        const start = newPath[i + 1];
        const end = newPath[i + 3];
        const direction = vector[0];
        const rules = new Rules(start, end, SearchStatus.DrawModification, this.line.map);

        tempWay = pointSearch(start, end, direction, rules);
        tempVector = new Point(tempWay[0], tempWay[1]);

        if (tempWay.length < 4 && tempVector.isSameDirection(vector[0])) {
          newPath.splice(i + 1, 3, ...tempWay);
          newPath.removeRepeat();
          i--;
        }
      }
      // 反向修饰
      else if (newPath.length > 4) {
        const start = newPath[i];
        const end = newPath[i + 3];
        const direction = vector[0];
        const rules = new Rules(start, end, SearchStatus.DrawModification, this.line.map);

        tempWay = pointSearch(start, end, direction, rules);

        if (tempWay.length < 4) {
          newPath.splice(i, 4, ...tempWay);
          newPath.removeRepeat();
          i--;
        }
      }
    }

    return newPath.removeRepeat();
  }

  /** 释放鼠标 */
  freeMouse() {
    this.mouseOverRecover?.();
    this.mouseOver = undefined;
    this.mouseOverRecover = undefined;
  }

  /** 覆盖元件 */
  setMouseOver(el: Line | Part) {
    this.mouseOver = el;
  }

  /** 搜索路径 */
  search(end: Point, bias: Point) {
    this.getSearchStatus(end, bias);
    this.getSearchPath();
    return this.getLinePath(end);
  }
}
