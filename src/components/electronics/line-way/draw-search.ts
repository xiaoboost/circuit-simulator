import { Point } from 'src/math';
import { isDef } from '@utils/assert';
import { LineWay } from './line-way';
import { pointSearch } from './point-search';
import { Rules } from './search-rules';
import { Cache } from './cache';
import { SearchStatus } from './types';

import type { Line } from '../line';
import type { Part } from '../part';
import type { DrawEvent } from 'src/lib/mouse';

// mouseOver: {
//   status: Mouse.Idle;
//   recover?(): void;
// } | {
//   status: Mouse.Part;
//   part: Part;
//   recover?(): void;
// } | {
//   status: Mouse.Line;
//   line: Line;
//   recover?(): void;
// };

/** 鼠标指向的状态 */
const enum MouseStatus {
  /** 鼠标指向为控 */
  Idle,
  /** 鼠标指向器件 */
  Part,
  /** 鼠标指向导线 */
  Line,
}

/** 当前搜索状态 */
let mouseStatus: MouseStatus = MouseStatus.Idle;
/** 搜索缓存 */
let cache: Cache<Point>;

/** 搜索初始化 */
export function init() {
  mouseStatus = MouseStatus.Idle;
  cache = new Cache<Point>((point) => {
    return point.join(',');
  });
}

/** 单点绘制 */
export function search(start: Point, direction: Point, event: DrawEvent, line: Line) {
  /** 终点 */
  const end = event.position;
  /** 终点所在方块左上角坐标 */
  const vertex = end.floor();
  /** 四方格坐标 */
  const endGrid = vertex.toGrid();

  let ends: Point[] = [];
  const status = SearchStatus.DrawSpace;

  debugger;

  // 导线终点默认最大半径
  line.points[1].size = 8;

  // 引脚复位
  // if (mouseOver.recover) {
  //   mouseOver.recover();
  //   mouseOver.recover = undefined;
  // }

  // 终点在器件上
  if (mouseStatus === MouseStatus.Part) {
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
  // 终点在导线上
  else if (mouseStatus === MouseStatus.Line) {
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
  // 终点闲置
  else {
    ends = endGrid;
  }

  // 按照到起点的距离，由大到小排序
  if (ends.length > 1) {
    ends = ends.sort(
      (pre, next) =>
        pre.distance(start) > next.distance(start) ? -1 : 1,
    );
  }

  // 节点搜索选项
  // const option = {
  //   start,
  //   direction,
  //   status,
  //   endBias,
  //   end: new Point(0, 0),
  // };


  // 搜索路径
  for (const point of ends) {
    // if (cache.has(point, endBias)) {
    //   continue;
    // }

    // 设置当前搜索终点
    // option.end = point;

    // 搜索并修饰
    const tempWay = pointSearch(
      start,
      point,
      direction,
      new Rules(start, point, status, line.map),
    );
    
    // .checkWayExcess({
    //   ...option,
    //   status: Status.Modification,
    // });

    // 记录当前搜索结果
    cache.set(point, tempWay);
  }

  let way = new LineWay();

  // if (status === Status.AlignPoint) {
  //   way = LineWay.from(cache.get(ends[0], endBias)!);
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
  //       way = LineWay.from(cache.get(closest, endBias)!);
  //       way.endToLine([endRound, closest], end);
  //       // pointSize.$set(1, 3);
  //     }
  //     else {
  //       way = LineWay.from(endRoundWay);
  //     }
  //   }
  //   else {
  //     way = LineWay.from(endRoundWay);
  //   }
  // }
  // else {
  // 选取终点中节点最多的路径
  const key = ends.filter((node) => cache.has(node)).reduce(
    (pre, next) =>
      (cache.get(pre)!.length >= cache.get(next)!.length) ? pre : next,
  );

  way = LineWay.from(cache.get(key)!);
  way.endToPoint(end);
  // }

  return way!;
}
