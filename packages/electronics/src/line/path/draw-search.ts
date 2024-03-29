import { Point } from '@circuit/math';
import { MarkNodeKind } from '@circuit/map';
import { isDef } from '@xiao-ai/utils';
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
  private readonly start: Point;
  /** 起始方向 */
  private readonly startDirection: Point;
  /** 当前导线 */
  private readonly line: Line;

  /** 鼠标的覆盖的状态 */
  private mouseOver?: Part | Line;
  /** 释放鼠标覆盖状态 */
  private mouseOverRecover?: () => void;
  /** 搜索缓存 */
  private cache = new Cache<Point, Point, LinePath>((point, direction) => {
    return direction
      ? `${point[0]}:${point[1]}-${direction[0]}:${direction[1]}`
      : `${point[0]}:${point[1]}`;
  });

  /** 搜索状态 */
  private status = SearchStatus.DrawSpace;
  /** 待搜索的终点列表 */
  private endList: Point[] = [];
  /** 优先出线方向 */
  private direction = Point.from([0, 0]);

  constructor(start: Point, direction: Point, line: Line) {
    this.start = start;
    this.startDirection = direction;
    this.line = line;
  }

  private getSearchStatus(end: Point, bias: Point) {
    const { mouseOver, line } = this;
    /** 终点所在方块左上角坐标 */
    const vertex = end.floor();
    /** 四方格坐标 */
    const endGrid = vertex.toGrid();
    /** 四方格中心坐标 */
    const endCenter = vertex.add(10);
    /** 至四方格中心坐标的偏移量 */
    const directionBias = endCenter.add(this.start, -1).sign().add(this.startDirection);

    /** 优先出线方向 */
    this.direction = Math.abs(directionBias[0]) > Math.abs(directionBias[1])
      ? new Point(directionBias[0], 0).sign()
      : new Point(0, directionBias[1]).sign();

    /** 导线空节点半径默认最大 */
    this.line.points[1].size = 8;

    // 引脚复位
    if (this.mouseOverRecover) {
      this.mouseOverRecover();
      this.mouseOverRecover = undefined;
    }

    // 终点在空白
    if (!mouseOver) {
      this.endList = endGrid;
      this.status = SearchStatus.DrawSpace;
    }
    // 终点在导线
    else if (mouseOver.kind === ElectronicKind.Line) {
      const mouseRound = end.round();
      const mouseStatus = line.map.get(mouseRound)!;

      // 导线交错节点或者是空闲节点，则直接对齐
      if (
        mouseStatus.kind === MarkNodeKind.LineSpacePoint ||
        mouseStatus.kind === MarkNodeKind.LineCrossPoint
      ) {
        this.status = SearchStatus.DrawAlignPoint;
        this.endList = [mouseRound];
      }
      // 否则选取四方格中在导线上的点
      else {
        this.status = SearchStatus.DrawAlignLine;
        this.endList = endGrid.filter((node) => line.map.get(node)?.isLine);
      }
    }
    // 终点在器件
    else {
      const overPart = mouseOver as Part;
      const points = overPart.points.map((point) => point.position);
      const mouseToPart = new Point(overPart.position, end.add(bias));
      const idlePoint = points.filter((_, i) => !overPart.connections[i].value);

      // 允许直接对齐
      if (idlePoint.length > 0) {
        // 导线终点缩小
        line.points[1].size = 2;

        // 优先对齐的引脚
        const allowPoint = mouseToPart.minAngle(idlePoint);
        const index = points.findIndex((node) => node.isEqual(allowPoint));

        // 该引脚缩放
        overPart.points[index].size = 2;
        // 缩放状态复位函数
        this.mouseOverRecover = () => {
          overPart.points[index].size = -1;
          overPart.updateView();
        };

        // 点对齐状态
        this.status = SearchStatus.DrawAlignPoint;
        // 终点只有需要对齐的点
        this.endList = [allowPoint.add(overPart.position)];

        // 器件更新视图
        overPart.updateView();
      }
      // 不允许直接对齐
      else {
        this.endList = endGrid;
      }
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
      if (cache.has(end, direction)) {
        continue;
      }

      const tempWay = this.removeExcess(pointSearch(
        start,
        end,
        direction,
        new Rules(start, end, status, line.map),
      ));

      cache.set(end, tempWay, direction);
    }
  }

  private getLinePath(end: Point) {
    const { cache, endList, status, line, direction } = this;

    let path = new LinePath();

    if (status === SearchStatus.DrawAlignPoint) {
      path = LinePath.from(cache.get(endList[0], direction)!);
    }
    else if (status === SearchStatus.DrawAlignLine) {
      const endRound = end.round();
      const endMapData = line.map.get(endRound)!;
      const endRoundWay = cache.get(endRound, direction)!;
      // 与<终点四舍五入的点>相连的坐标集合与四方格坐标集合的交集
      const roundSet = this.endList.filter((node) => {
        return endMapData.connections.has(node)
          ? line.map.get(node)?.kind !== MarkNodeKind.PartPin
          : false;
      });

      if (roundSet.length > 0) {
        // 交集中离鼠标最近的点
        const closest = end.closest(roundSet);
        const similarPath = cache.get(closest, direction);
        // 导线形状相似
        if (similarPath && endRoundWay.isSimilar(similarPath)) {
          path = LinePath.from(similarPath);
          path.endToLine([endRound, closest], end);
          line.points[1].size = 3;
        }
        else {
          path = LinePath.from(endRoundWay);
        }
      }
      else {
        path = LinePath.from(endRoundWay);
      }
    }
    else {
      // 选取终点中节点最多的路径
      const paths = endList
        .map((node) => cache.get(node, direction))
        .filter(isDef)
        .reduce(
          (pre, next) => pre.length >= next.length ? pre : next,
        );

      path = LinePath.from(paths);
      path.endToPoint(end);
    }

    return path;
  }

  private removeExcess(path: LinePath) {
    const newPath = LinePath.from(path);

    if (newPath.length <= 3) {
      return newPath;
    }

    // 如果初始方向和第二个线段方向相同，说明此处需要修正
    if (this.direction.isSameDirection(new Point(newPath[1], newPath[2]))) {
      const start = newPath[0];
      const end = newPath[2];
      const rules = new Rules(start, end, SearchStatus.DrawModification, this.line.map);
      const temp = pointSearch(start, end, this.direction, rules);

      newPath.splice(0, 3, ...temp);
      newPath.removeRepeat();
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
        const rules = new Rules(start, end, SearchStatus.DrawModification, this.line.map);
        const tempWay = pointSearch(start, end, direction, rules);
        const tempVector = new Point(tempWay[0], tempWay[1]);

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
        const tempWay = pointSearch(start, end, direction, rules);

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
  search(end: Point, bias: Point = Point.from([0, 0])) {
    this.getSearchStatus(end, bias);
    this.getSearchPath();
    return this.getLinePath(end);
  }
}
