import { Point } from '@circuit/math';
import { SearchStatus } from './constant';
import { SearchNodeData } from './point-search';
import { MarkMap, MarkNodeKind } from '@circuit/map';

// 工具函数
// 返回 node 所在器件
function getPart(map: MarkMap, node: Point) {
  const status = map.get(node);

  if (status?.kind === MarkNodeKind.Part || status?.kind === MarkNodeKind.PartPin) {
    return status.label.id;
  }
}
// 返回 node 所在线段
function getSegment(map: MarkMap, node: Point) {
  const data = map.get(node);

  if (!data?.isLine) {
    return [];
  }

  const ans = [];
  for (let i = 0; i < 2; i++) {
    const directors = [[1, 0], [-1, 0], [0, -1], [0, 1]];
    const limit = [
      data.alongLine(directors[i * 2]),
      data.alongLine(directors[i * 2 + 1]),
    ];

    if (!limit[0].position.isEqual(limit[1].position)) {
      ans.push(limit.map(({ position }) => position));
    }
  }
  return ans;
}
// node 是否在某线段内
function isNodeInLine(node: Point, line: Point[]) {
  return node.isInLine(line);
}
// 距离表征（非真实距离）
function nodesDistance(a: Point, b: Point) {
  return (
    Math.abs(a[0] - b[0]) +
    Math.abs(a[1] - b[1])
  );
}
// node 所在线段是否和当前节点方向垂直
function isNodeVerticalLine(map: MarkMap, node: SearchNodeData) {
  const status = map.get(node.position);

  if (!status || !status.connections) {
    return false;
  }

  return status.connections.every(
    (connect) =>
      connect.add(node.position, -1).isVertical(node.direction),
  );
}

// 价值估算
// node 到终点距离 + 拐弯数量
function calToPoint(this: Rules, node: SearchNodeData) {
  return (nodesDistance(this.end, node.position) + node.junction * 20);
}

// 终点判定
// 等于终点
function isEndPoint(this: Rules, node: SearchNodeData) {
  return this.end.isEqual(node.position);
}
// 在终点等效线段中
function isInEndLines(this: Rules, node: SearchNodeData) {
  return this.endLines.find((line) => isNodeInLine(node.position, line));
}
// 绘制导线时，终点在导线中
function checkNodeInLineWhenDraw(this: Rules, node: SearchNodeData) {
  // 优先判断是否等于终点
  if (node.position.isEqual(this.end)) {
    return (true);
  }

  // 是否在终点等效线段中
  const exLine = isInEndLines.call(this, node) as ReturnType<typeof isInEndLines>;

  // 不在等效终线中
  if (!exLine) {
    return false;
  }
  // 当前路径是直线
  if (!node.junction) {
    return true;
  }

  // 等效线段和当前节点方向平行
  if (exLine[1].add(exLine[0], -1).isParallel(node.direction)) {
    return true;
  }
  // 等效线段和当前节点方向垂直
  else {
    const junction = node.cornerParent.direction;
    const node2End = this.end.add(node.position, -1);

    return (node2End.isOppositeDirection(junction));
  }
}

// 扩展判定
// 通用状态
function isLegalPointGeneral(this: Rules, node: SearchNodeData, pointLimit = 2): boolean {
  const status = this.map.get(node.position);

  // 空节点
  if (!status) {
    return true;
  }
  // 器件节点
  else if (status.kind === MarkNodeKind.Part) {
    return this.excludeParts.includes(status.label.id);
  }
  // 器件节点
  else if (status.kind === MarkNodeKind.PartPin) {
    // 距离等于 1 的范围内都可以
    const part = status.label.id;
    return (
      this.excludeParts.includes(part) ||
      nodesDistance(node.position, this.end) < pointLimit
    );
  }
  // 导线结点
  else if (status.kind === MarkNodeKind.LineSpacePoint) {
    // 排除、或者距离在 1 以内
    return (
      this.excludeLines.some((line) => isNodeInLine(node.position, line)) ||
      nodesDistance(node.position, this.end) < pointLimit
    );
  }
  // 导线
  else if (this.map.get(node.position)?.isLine) {
    // 当前节点方向必须和所在导线方向垂直
    return (isNodeVerticalLine(this.map, node));
  }
  else {
    return true;
  }
}
// 强制对齐
function isLegalPointAlign(this: Rules, node: SearchNodeData) {
  return isLegalPointGeneral.call(this, node, 1) as boolean;
}

/** 规则集合 */
export class Rules {
  start: Point;
  end: Point;
  map: MarkMap;
  status: SearchStatus;

  /** 排除器件 */
  excludeParts: string[] = [];
  /** 排除线段 */
  excludeLines: Point[][] = [];
  /** 终点等效线段 */
  endLines: Point[][] = [];

  calValue!: (node: SearchNodeData) => number;
  checkPoint!: (node: SearchNodeData) => boolean;
  isEnd!: (node: SearchNodeData) => boolean;

  /**
   * 创建规则集合的实例
   *  - 起点和终点都是未缩放的值
   * @param {Point} start - 起点
   * @param {Point} end - 终点
   * @param {SearchStatus} status 当前状态
   */
  constructor(start: Point, end: Point, status: SearchStatus, map: MarkMap) {
    this.start = start;
    this.end = end;
    this.status = status;
    this.map = map;

    // 单点绘制
    if (status < 20) {
      // 节点估值
      this.calValue = calToPoint;

      // 绘制情况下，end 只可能是点，根据终点属性来进一步分类
      const endData = map.get(this.end);

      if (!endData) {
        this.isEnd = isEndPoint;
        this.checkPoint = isLegalPointGeneral;
      }
      else if (endData.isLine) {
        this.endLines.push(...getSegment(this.map, this.end));
        this.isEnd = checkNodeInLineWhenDraw;
        this.checkPoint = isLegalPointAlign;
      }
      else if (endData.kind === MarkNodeKind.PartPin) {
        this.isEnd = isEndPoint;
        this.checkPoint = isLegalPointAlign;
      }
      else if (endData.kind === MarkNodeKind.Part) {
        const partId = getPart(this.map, this.end);

        partId && this.excludeParts.push[partId];

        this.isEnd = isEndPoint;
        this.checkPoint = isLegalPointGeneral;
      }
    }
  }
}
