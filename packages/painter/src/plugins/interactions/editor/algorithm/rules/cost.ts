import type { SearchNodeData } from '../a-star';
import type { RulesContext } from './types';

/**
 * 路径基础代价
 *
 * @description 拐弯 * 10 + 路径长度
 */
function gPathBaseCost(this: RulesContext, node: SearchNodeData) {
  return node.junction * 10;
}

/**
 * 到终点的曼哈顿距离
 *
 * @description 到终点的曼哈顿距离作为基础的启发式计算
 */
function hEndDistanceCost(this: RulesContext, node: SearchNodeData) {
  return this.end.manhattanDistance(node.position);
}

/**
 * 点估值
 *
 * @description 单纯的搜索终点路径
 */
export function toPointCost(this: RulesContext, node: SearchNodeData) {
  return hEndDistanceCost.call(this, node) + gPathBaseCost.call(this, node);
}

/**
 * 带参考路径的点估值
 *
 * @description 整体代价计算会尽量贴近参考路径
 */
export function toPointCostWithRefPath(this: RulesContext, node: SearchNodeData) {
  /** 参考路径的距离权重 */
  const REF_DISTANCE_WEIGHT = 0.5;
  /** 当且仅当贴在参考路径上时的方向不一致惩罚 */
  const REF_DIRECTION_PENALTY = 3;
  /** 向参考路径终点方向的“进度”项（索引差）权重 */
  const REF_PROGRESS_WEIGHT = 1;

  const { referencePath: refPath } = this;

  // 基础代价计算
  const baseH = hEndDistanceCost.call(this, node);
  const baseG = gPathBaseCost.call(this, node);

  // 无参考或参考不足以成段时，回退到单纯的搜索终点路径
  if (!refPath || refPath.length < 2) {
    return baseG + baseH;
  }

  // 计算到参考路径各线段的最近曼哈顿距离，以及对应线段索引
  let minDistance = Infinity;
  let nearestSegmentIndex = -1;

  for (let i = 0; i < refPath.length - 1; i++) {
    const segment = [refPath[i], refPath[i + 1]];
    const d = node.position.manhattanDistanceToSegment(segment);

    if (d < minDistance) {
      minDistance = d;
      nearestSegmentIndex = i;

      // 最优为 0，直接退出
      if (minDistance === 0) {
        break;
      }
    }
  }

  // 方向代价：仅在贴合在参考路径上时检查
  let directionPenalty = 0;
  if (minDistance === 0 && nearestSegmentIndex >= 0) {
    const segment = refPath[nearestSegmentIndex + 1].add(refPath[nearestSegmentIndex], -1);
    const isHorizontal = segment.isHorizontal();
    const nodeIsHorizontal = node.direction.isHorizontal();
    directionPenalty = (isHorizontal === nodeIsHorizontal) ? 0 : REF_DIRECTION_PENALTY;
  }

  // 进度项：鼓励沿参考路径朝终点一侧前进
  // 终点在参考路径上的“目标索引” -> 取 refPath 中距离 end 最近的点索引
  let endClosestIndex = 0;
  if (refPath.length > 0) {
    let best = Infinity;
    for (let i = 0; i < refPath.length; i++) {
      const d = this.end.manhattanDistance(refPath[i]);
      if (d < best) {
        best = d;
        endClosestIndex = i;
      }
    }
  }

  // 当前“进度索引”近似取最近线段起点索引（已足够稳定，且计算简单）
  const progressIndex = nearestSegmentIndex >= 0 ? nearestSegmentIndex : 0;
  const progressCost = Math.abs(progressIndex - endClosestIndex) * REF_PROGRESS_WEIGHT;

  // 贴合距离项
  const refDistanceCost = (minDistance === Infinity ? 0 : (minDistance * REF_DISTANCE_WEIGHT));
  const gRefPath = refDistanceCost + directionPenalty + progressCost;

  return baseG + gRefPath + baseH;
}
