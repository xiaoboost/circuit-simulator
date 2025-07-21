import { PathWithPoint, Rotate, RotateMatrixSet } from '@circuit/algorithm';
import { SearchStack } from './stack';
import type { SearchNodeData, AStarSearchOption } from './types';

/** 扩展方向矩阵 */
const rotateList = [
  Rotate.Same,
  Rotate.Clockwise,
  Rotate.AntiClockwise,
];

/** 生成新节点 */
function newNode(node: SearchNodeData, index: Rotate): SearchNodeData {
  const direction = node.direction.rotate(RotateMatrixSet[index]);

  return {
    direction,
    value: 0,
    parent: node,
    cornerParent: (index === Rotate.Same ? node.cornerParent : node),
    junction: index === Rotate.Same ? node.junction : node.junction + 1,
    position: node.position.add(direction.mul(20)),
  };
}

/** A* 单点寻路 */
export function aStarSearch({
  start,
  end,
  direction,
  rules,
  hook,
}: AStarSearchOption): PathWithPoint {
  const stack = new SearchStack();
  const first: SearchNodeData = {
    position: start,
    direction,
    junction: 0,
    value: 0,
    cornerParent: undefined as any,
  };

  // 起点的 cornerParent 等于其自身
  first.cornerParent = first;
  first.value = rules.cost(first);
  stack.push(first);

  hook?.useStartNode?.(first);

  // 终点状态
  let endStatus: SearchNodeData | undefined = void 0;

  // 检查起点
  if (rules.isEnd(first)) {
    endStatus = first;
  }

  // A* 搜索，搜索极限为 300
  while (!endStatus && (stack.closeSize < 300)) {
    // 栈顶元素弹出为当前节点
    const nodeNow = stack.shift();

    // 未处理的节点为空，终点无法达到
    if (!nodeNow) {
      break;
    }

    hook?.useCurrentNode?.(nodeNow);

    // 按方向扩展
    for (let i = 0; i < rotateList.length; i++) {
      // 生成扩展节点
      const nodeExpand = newNode(nodeNow, rotateList[i]);

      nodeExpand.value = rules.cost(nodeExpand);

      hook?.useExpandNode?.(nodeExpand);

      // 判断是否是终点
      if (rules.isEnd(nodeExpand)) {
        endStatus = nodeExpand;
        hook?.useEndNode?.(endStatus);
        break;
      }

      // 当前节点是否满足扩展要求
      if (rules.check(nodeExpand)) {
        stack.push(nodeExpand);
      }
    }

    // 没有可能路径，直接返回
    if (!stack.openSize && !endStatus) {
      return ([start]);
    }
  }

  if (!endStatus) {
    return [start, end];
  }

  // 终点回溯，生成路径
  const way: PathWithPoint = [];

  while (endStatus.parent && endStatus !== endStatus.cornerParent) {
    way.push(endStatus.position);
    endStatus = endStatus.cornerParent;
  }

  way.push(start);
  way.reverse();

  hook?.useEndSearch?.(way);

  return way;
}
