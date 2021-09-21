import { Point } from '@circuit/math';
import { SearchStatus } from './constant';
import { SearchNodeData } from './search-point';
import { MarkMap, MarkNodeKind } from '@circuit/map';

// 返回 node 所在器件
function getPart(map: MarkMap, node: Point) {
  const status = map.get(node);

  if (status?.kind === MarkNodeKind.Part || status?.kind === MarkNodeKind.PartPin) {
    return status.labels.value!.id;
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
  return node.isInSegment(line);
}
// node 是否在线段集合中
function isNodeInLines(node: Point, lines: Point[][]) {
  for (let i = 0; i < lines.length; i++) {
    if (isNodeInLine(node, lines[i])) {
      return true;
    }
  }
  return false;
}
// 距离表征（非真实距离）
function nodeDistance(a: Point, b: Point) {
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

  declare calValue: (node: SearchNodeData) => number;
  declare checkPoint: (node: SearchNodeData) => boolean;
  declare isEnd: (node: SearchNodeData) => boolean;

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
      this.calValue = this.calToPoint01.bind(this);

      // 绘制情况下，end 只可能是点，根据终点属性来进一步分类
      const endData = map.get(this.end);

      if (!endData) {
        this.isEnd = this.isEndPoint.bind(this);
        this.checkPoint = this.isLegalPointGeneral.bind(this);
      }
      else if (endData.isLine) {
        this.endLines.push(...getSegment(this.map, this.end));
        this.isEnd = this.isInLineWhenDraw.bind(this);
        this.checkPoint = this.isLegalPointAlign.bind(this);
      }
      else if (endData.kind === MarkNodeKind.PartPin) {
        this.isEnd = this.isEndPoint.bind(this);
        this.checkPoint = this.isLegalPointAlign.bind(this);
      }
      else if (endData.kind === MarkNodeKind.Part) {
        const partId = getPart(this.map, this.end);

        partId && this.excludeParts.push[partId];

        this.isEnd = this.isEndPoint.bind(this);
        this.checkPoint = this.isLegalPointGeneral.bind(this);
      }
    }
    // 变形搜索
    else if (status < 30) {
      this.excludeLines = getSegment(this.map, this.end);
      this.calValue = this.calToPoint02.bind(this);
      this.isEnd = this.isInEndLines.bind(this);
      this.checkPoint = this.checkPointExcludeLine.bind(this);
    }
  }

  // 价值估算函数
  /** 价值估算函数 - `node`到终点距离 + 拐弯数量 */
  private calToPoint01(node: SearchNodeData) {
    return (nodeDistance(this.end, node.position) + node.junction * 20);
  }
  /** 价值估算函数 - `node`到终线的距离 * 3 + 拐弯的数量 * 3 + `node`到起点的距离 */
  private calToPoint02(node: SearchNodeData) {
    return (
      this.calToPoint01(node) * 3 +
      nodeDistance(node.position, this.start)
    );
  }

  // 终点判定
  /** 终点判定 - 等于终点 */
  private isEndPoint(node: SearchNodeData) {
    return this.end.isEqual(node.position);
  }
  /** 终点判定 - 在终点等效线段中 */
  private isInEndLines(node: SearchNodeData) {
    return Boolean(this.endLines.find((line) => isNodeInLine(node.position, line)));
  }
  /** 终点判定 - 绘制导线时，终点在导线中 */
  private isInLineWhenDraw(node: SearchNodeData) {
    // 优先判断是否等于终点
    if (node.position.isEqual(this.end)) {
      return (true);
    }

    // 是否在终点等效线段中
    const exLine = this.isInEndLines.call(this, node) as ReturnType<typeof this.isInEndLines>;

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
  /** 扩展判定 - 通用状态 */
  private isLegalPointGeneral(node: SearchNodeData, pointLimit = 2): boolean {
    const status = this.map.get(node.position);

    // 空节点
    if (!status) {
      return true;
    }
    // 器件节点
    else if (status.kind === MarkNodeKind.Part) {
      return this.excludeParts.includes(status.labels.value!.id);
    }
    // 器件节点
    else if (status.kind === MarkNodeKind.PartPin) {
      // 距离等于 1 的范围内都可以
      const part = status.labels.value!.id;
      return (
        this.excludeParts.includes(part) ||
        nodeDistance(node.position, this.end) < pointLimit
      );
    }
    // 导线结点
    else if (status.kind === MarkNodeKind.LineSpacePoint) {
      // 排除、或者距离在 1 以内
      return (
        this.excludeLines.some((line) => isNodeInLine(node.position, line)) ||
        nodeDistance(node.position, this.end) < pointLimit
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
  /** 扩展判定 - 强制对齐 */
  private isLegalPointAlign(node: SearchNodeData) {
    return this.isLegalPointGeneral.call(this, node, 1) as boolean;
  }
  /** 扩展判定 - 排除器件 */
  private checkPointExcludePart(node: SearchNodeData) {
    const status = this.map.get(node.position);

    if (!status) {
      return (true);
    }
    else if (status.kind === MarkNodeKind.Part) {
      const id = status.labels.value?.id;
      return id && this.excludeParts.includes(id);
    }
    else if (status.kind === MarkNodeKind.PartPin) {
      const id = status.labels.value?.id;
      return Boolean(
        id && this.excludeParts.includes(id) ||
        nodeDistance(node.position, this.end) < 2
      );
    }
    else if (
      status.kind === MarkNodeKind.Line ||
      status.kind === MarkNodeKind.LineCrossPoint
    ) {
      return (isNodeVerticalLine(this.map, node));
    }
    else {
      return true;
    }
  }
  /** 扩展判定 - 排除导线 */
  private checkPointExcludeLine(node: SearchNodeData) {
    const status = this.map.get(node.position);

    if (!status) {
      return true;
    }
    else if (
      status.kind === MarkNodeKind.Part ||
      status.kind === MarkNodeKind.PartPin
    ) {
      return false;
    }
    else if (
      status.kind === MarkNodeKind.Line ||
      status.kind === MarkNodeKind.LineCrossPoint
    ) {
      return (
        isNodeInLines(node.position, this.excludeLines) ||
        isNodeVerticalLine(this.map, node)
      );
    }
    else {
      return true;
    }
  }
  /** 扩展判定 - 排除器件/导线 */
  private checkPointExcludeAlign(node: SearchNodeData) {
    const status = this.map.get(node.position);

    if (!status) {
      return true;
    }
    else if (status.kind === MarkNodeKind.Part) {
      const id = status.labels.value?.id;
      return id && this.excludeParts.includes(id);
    }
    else if (status.kind === MarkNodeKind.PartPin) {
      const id = status.labels.value?.id;
      return Boolean(
        id && this.excludeParts.includes(id) ||
        node.position.isEqual(this.end)
      );
    }
    else if (
      status.kind === MarkNodeKind.Line ||
      status.kind === MarkNodeKind.LineCrossPoint
    ) {
      return (
        isNodeInLines(node.position, this.excludeLines) ||
        isNodeVerticalLine(this.map, node)
      );
    }
    else {
      return true;
    }
  }
}
