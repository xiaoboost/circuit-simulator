import { Rules } from './search-rules';
import { LineWay } from './line-way';
import { SearchStatus } from './types';
import { remove } from '@utils/array';
import { Debugger } from 'src/lib/debugger';
import { Point, Rotates, RotateMatrix } from 'src/math';

/** 搜索用节点数据 */
export interface SearchNodeData {
  /** 当前节点位置 */
  position: Point;
  /** 当前节点是由什么方向扩展而来 */
  direction: Point;
  /** 当前节点估值 */
  value: number;
  /** 扩展到当前节点共有多少个弯道 */
  junction: number;
  /** 当前节点的祖节点 */
  parent?: SearchNodeData;
  /** 当前节点拐弯的祖节点 */
  cornerParent: SearchNodeData;
}

/** 节点搜索选项接口 */
export interface PointSearchOption {
  start: Point;
  end: Point;
  direction: Point;
  endBias?: Point;
  status: SearchStatus;
}

/** 搜索用的临时图纸模块 */
export class SearchMap {
  /** 数据记录 */
  private map: AnyObject<SearchNodeData> = {};

  static toKey(node: Point) {
    return node.join(',');
  }

  get(node: Point): undefined | SearchNodeData {
    return this.map[SearchMap.toKey(node)];
  }
  set(value: SearchNodeData) {
    this.map[SearchMap.toKey(value.position)] = value;
  }
}

/** 搜索树 */
export class SearchStack {
  /** 搜索堆栈数据 */
  private stack: AnyObject<SearchNodeData[]> = {};
  /** 数据堆栈估值顺序记录表 */
  private hash: number[] = [];
  /** 搜索图数据 */
  private map = new SearchMap();

  /** 未处理数据大小 */
  openSize = 0;
  /** 已处理数据大小 */
  closeSize = 0;

  /** 弹出估值最小且最早入栈的节点数值 */
  shift() {
    const minValue = this.hash[0];
    const stackCol = this.stack[minValue];

    if (stackCol) {
      const shift = stackCol.shift();

      if (stackCol.length === 0) {
        delete this.stack[minValue];
        this.hash.shift();
      }

      this.openSize--;
      this.closeSize++;

      return (shift);
    }
  }

  /** 将输入的节点放置到合适的位置 */
  push(node: SearchNodeData) {
    const value = node.value;
    const origin = this.map.get(node.position);

    // 当前位置已存在数据
    if (origin) {
      // 输入数据的估值并不低于已有数据，于是放弃
      if (value >= origin.value) {
        return;
      }

      // 已有数据所在的数据列
      const originCol = this.stack[origin.value];

      /**
       * 若数据列存在，则在数据列中删除原有数据
       *  - 这里必须加这个判断，因为数据列是可能不存在的
       */
      if (originCol) {
        // 从数据列中删除已有数据
        remove(originCol, origin);
        // 弱数据列为空，则删除数据列
        if (originCol.length === 0) {
          delete this.stack[origin.value];
          remove(this.hash, origin.value);
        }
      }
    }

    // 如果 value 在堆栈中不存在对应的数据列，新建数据列
    if (!this.stack[value]) {
      this.stack[value] = [];

      this.hash.push(value);
      this.hash.sort((pre, next) => pre > next ? 1 : -1);
    }

    // 当前数据加入堆栈
    this.stack[value].push(node);
    this.map.set(node);
    this.openSize++;
  }
}

/** 生成新节点 */
function newNode(node: SearchNodeData, index: RotateMatrix): SearchNodeData {
  const direction = node.direction.rotate(Rotates[index]);

  return {
    direction,
    value: 0,
    parent: node,
    cornerParent: (index > 0 ? node : node.cornerParent),
    junction: node.junction + (index > 0 ? 1 : 0),
    position: node.position.add(direction),
  };
}

/** A* 单点寻路 */
export function pointSearch(
  start: Point,
  end: Point,
  direction: Point,
  rules: Rules,
): LineWay {
  const stack = new SearchStack();
  // const rules = new Rules(start, end, status);

  // // 方向偏移
  // const sumDirection = endBias.add(start, -1).sign().add(originDirection);
  // const direction = Math.abs(sumDirection[0]) > Math.abs(sumDirection[1])
  //   ? new Point(sumDirection[0], 0).sign()
  //   : new Point(0, sumDirection[1]).sign();

  // 生成初始节点
  const first: SearchNodeData = {
    position: start.mul(0.05),
    direction,
    junction: 0,
    value: 0,
    cornerParent: undefined as any,
  };

  // 起点的 cornerParent 等于其自身
  first.cornerParent = first;
  first.value = rules.calValue(first);
  stack.push(first);

  // 调试用时，指示终点
  /* istanbul ignore if */
  if (process.env.NODE_ENV === 'development') {
    Debugger.point(first.position, 'red', 20);
  }

  // 终点状态
  let endStatus: SearchNodeData | undefined = void 0;

  // 检查起点
  if (rules.isEnd(first)) {
    endStatus = first;
  }

  // A*搜索，搜索极限为 300
  while (!endStatus && (stack.closeSize < 300)) {
    // 栈顶元素弹出为当前节点
    const nodeNow = stack.shift();

    // 未处理的节点为空，终点无法达到
    if (!nodeNow) {
      break;
    }

    if (process.env.NODE_ENV === 'development') {
      Debugger.point(nodeNow.position, 'blue', 20);
    }

    // 按方向扩展
    for (let i = 0; i < 3; i++) {
      // 生成扩展节点
      const nodeExpand = newNode(nodeNow, i);

      nodeExpand.value = rules.calValue(nodeExpand);

      if (process.env.NODE_ENV === 'development') {
        Debugger.point(nodeExpand.position, 'black', 20);
      }

      // 判断是否是终点
      if (rules.isEnd(nodeExpand)) {
        endStatus = nodeExpand;
        break;
      }

      // 当前节点是否满足扩展要求
      if (rules.checkPoint(nodeExpand)) {
        stack.push(nodeExpand);
      }
    }

    // 没有可能路径，直接返回
    if (!stack.openSize && !endStatus) {
      return (LineWay.from([start]));
    }
  }

  if (process.env.NODE_ENV === 'development') {
    Debugger.clearAll();
  }

  if (!endStatus) {
    return LineWay.from([start, end]);
  }

  // 终点回溯，生成路径
  const way = new LineWay();

  while (endStatus.parent && endStatus !== endStatus.cornerParent) {
    way.push(endStatus.position.mul(20));
    endStatus = endStatus.cornerParent;
  }

  way.push(start);
  way.reverse();
  return (way);
}
